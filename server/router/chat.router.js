import express from "express";
import ChatController from "../controller/chat.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const chatController = new ChatController();
const router = express.Router();
// add message
router.post("/", protect, (req, res) => {
  chatController.addChatMessage(req, res);
});
// get chats
router.get("/", protect, (req, res) => {
  chatController.fetchChats(req, res);
});
// create group
router.post("/group", protect, (req, res) => {
  chatController.groupChat(req, res);
});
// rename group
router.put("/rename", protect, (req, res) => {
  chatController.renameGroupChat(req, res);
});
// remove group member
router.put("/removegroupmember", protect, (req, res) => {
  chatController.removeFromGroup(req, res);
});
// add group member
router.put("/addgroupmember", protect, (req, res) => {
  chatController.addToGroup(req, res);
});
// Handle default routes
router.get("*", (req, res) => {
  res.send(
    "Welcome to Insta Connect. This is a real time Chat App to conclude some insights."
  );
});
export default router;
