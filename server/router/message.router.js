import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import MessageController from "../controller/message.controller.js";
const messageController = new MessageController();
const router = express.Router();
// Get specific chat
router.get("/:chatId", protect, (req, res) => {
  messageController.allMessages(req, res);
});
// send message
router.post("/", protect, (req, res) => {
  messageController.sendMessage(req, res);
});
// Handle default routes
router.get("*", (req, res) => {
  res.send(
    "Welcome to Insta Connect. This is a real time Chat App to conclude some insights."
  );
});
export default router;
