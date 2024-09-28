import dotenv from "dotenv";
import express from "express";
import colors from "colors";
import http from "http";
import { Server } from "socket.io";
import router from "./router/index.router.js";
import { connectUsingMongoose } from "./config/mongoose.js";
import error from "./middleware/error.middleware.js";
import cors from "cors";
import User from "./models/user.model.js";
// for managing global variables
dotenv.config();
// server instance
const app = express();
// For allowing cross origin access from frontend to the backend
app.use(cors());
// Sockets server for real time connection
const chatServer = http.Server(app);
const io = new Server(chatServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});
// Online users array
const onlineUsers = new Set();
// Everytime user connects
io.on("connection", (socket) => {
  // building room for chats
  socket.on("setup", (userData) => {
    socket.join(userData.data._id);
    socket.emit("connected");
  });
  // Notifying for onlline status
  socket.on("onlinestatus", (userdata) => {
    onlineUsers.add(userdata);
    io.emit("onlinestatus", Array.from(onlineUsers));
  });
  // Notifying for offline status
  socket.on("offlinestatus", (userdata) => {
    if (onlineUsers.has(userdata)) {
      onlineUsers.delete(userdata);
      io.emit("onlinestatus", Array.from(onlineUsers));
    }
  });
  // Providing room details
  socket.on("join chat", (room) => {
    socket.join(room);
  });
  // Updating real time messaging
  socket.on("new message", (newMessageReceived) => {
    let chat = newMessageReceived.chat;
    if (!chat.users) {
      return console.log("chat.users is not defined");
    }
    chat.users.forEach((user) => {
      if (user._id === newMessageReceived.sender._id) {
        return;
      }
      socket.in(user._id).emit("message received", newMessageReceived);
    });
  });
  // Updating real time message indicator
  socket.on("typing", (room) => {
    return socket.in(room).emit("typing");
  });
  // Updating typing status to false
  socket.on("stop typing", (room) => {
    return socket.in(room).emit("stop typing");
  });
  // Remove active session
  socket.on("disconnect", () => {
    socket.leave(socket.id);
  });
});
chatServer.listen(5000, () => {
  console.log("Chat serve is listeniong on 5000");
});
// Parsing json data
app.use(express.json());
// const corsOptions = {
//   origin: ["http://localhost:5173"],
//   methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
//   credentials: true,
//   optionsSuccessStatus: 204,
// };
// main route
app.use("/", router);
// error handling
app.use(error.errorHandler);
app.use(error.notFound);
// enabling PORT
const PORT = process.env.PORT || 2024;
// Setting up the server
app.listen(PORT, () => {
  connectUsingMongoose();
  console.log(`Running at ${PORT}`.yellow.bold);
});
