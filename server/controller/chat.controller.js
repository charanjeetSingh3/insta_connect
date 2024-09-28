import expressAsyncHandler from "express-async-handler";
import Chat from "../models/chat.model.js";
import User from "../models/user.model.js";
export default class ChatController {
  addChatMessage = expressAsyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
      res.status(401).json({ success: false, message: "Invalid request." });
    }
    let isChat = await Chat.find({
      isGroupChat: false,
      $and: [
        { users: { $elemMatch: { $eq: req.user._id } } },
        { users: { $elemMatch: { $eq: userId } } },
      ],
    })
      .populate("users", "-password")
      .populate("latestMessage");
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });
    if (isChat.length > 0) {
      res.status(200).send(isChat[0]);
    } else {
      let chatData = {
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      };
      try {
        const createdChat = await Chat.create(chatData);
        const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
          "users",
          "-password"
        );
        res.status(200).json({ status: true, data: fullChat });
      } catch (error) {
        throw new Error(error.message);
      }
    }
  });
  fetchChats = expressAsyncHandler(async (req, res) => {
    try {
      const results = await Chat.find({
        users: { $elemMatch: { $eq: req.user._id } },
      })
        .populate("users", "-password")
        .populate("groupAdmins", "-password")
        .populate("latestMessage")
        .sort({ updatedAt: -1 });
      const result = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name pic email",
      });
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Unable to find the chat" });
      throw new Error(err.message);
    }
  });
  groupChat = expressAsyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill in all the fields." });
    }
    let users = JSON.parse(req.body.users);
    if (users.length < 2) {
      return res.status(400).json({
        success: false,
        message: "More that 2 users are required to form a Group Chat.",
      });
    }
    users.push(req.user);
    try {
      const groupChat = await Chat.create({
        chatName: req.body.name,
        users: users,
        isGroupChat: true,
        groupAdmins: req.user,
      });
      const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
      res.send(fullGroupChat);
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Failed to create a new Group." });
      throw new Error(err.message);
    }
  });
  renameGroupChat = expressAsyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;
    try {
      const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
          chatName,
        },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
      if (!updatedChat) {
        res.status(400);
        throw new Error("Chat not found.");
      } else {
        res.status(200).json({ success: true, data: updatedChat });
      }
    } catch (err) {
      res
        .status(400)
        .json({ success: false, message: "Failed to update chat name." });
      throw new Error(err.message);
    }
  });
  addToGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    try {
      const added = await Chat.findByIdAndUpdate(
        chatId,
        { $push: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
      if (!added) {
        res.status(404);
        throw new Error("Chat not Found");
      } else {
        res.status(200).json({ success: true, data: added });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "Failed to add user to a Group.",
      });
      throw new Error(err.message);
    }
  });
  removeFromGroup = expressAsyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;
    try {
      const removed = await Chat.findByIdAndUpdate(
        chatId,
        { $pull: { users: userId } },
        { new: true }
      )
        .populate("users", "-password")
        .populate("groupAdmins", "-password");
      if (!removed) {
        res.status(404);
        throw new Error("Chat not Found");
      } else {
        res.status(200).json({ success: true, data: removed });
      }
    } catch (err) {
      res.status(400).json({
        success: false,
        message: "Failed to remove user from Group.",
      });
      throw new Error(err.message);
    }
  });
}
