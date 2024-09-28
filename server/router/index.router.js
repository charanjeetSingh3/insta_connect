import express from "express";
import userRouter from "./user.router.js";
import chatRouter from "./chat.router.js";
import messageRouter from "./message.router.js";
const router = express.Router();
// send routing request to the user router
router.use("/api/user", userRouter);
// send routing request to the chat router
router.use("/api/chat", chatRouter);
// send routing request to the message router
router.use("/api/message", messageRouter);
router.get("*", (req, res) => {
  res.send(
    "Welcome to Insta Connect. This is a real time Chat App to conclude some insights."
  );
});
export default router;
