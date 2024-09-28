import express from "express";
import UserController from "../controller/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
const router = express.Router();
const userController = new UserController();
// Sign Up
router.post("/create", (req, res) => {
  userController.registerUser(req, res);
});
// sign in
router.post("/login", (req, res) => {
  userController.authUser(req, res);
});
// get all the users
router.get("/all", protect, (req, res) => {
  userController.allUsers(req, res);
});
// get all the chats
router.get("/chats", (req, res) => {
  res.send("Chats");
});
// Handle default routes
router.get("*", (req, res) => {
  res.send(
    "Welcome to Insta Connect. This is a real time Chat App to conclude some insights."
  );
});
export default router;
