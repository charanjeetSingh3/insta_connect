import expressAsyncHandler from "express-async-handler";
import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import Chat from "../models/chat.model.js";
export default class MessageController {
  sendMessage = expressAsyncHandler(async (req, res) => {
    const { content, chatId } = req.body;
    if (!content || !chatId || !req.user) {
      return res
        .status(400)
        .json({ status: false, message: "Invalid data passed." });
    }
    const newMessage = {
      sender: req.user,
      content: content,
      chat: chatId,
    };
    try {
      let message = await Message.create(newMessage);
      message = await message.populate("sender", "name picture");
      message = await message.populate("chat");
      message = await User.populate(message, {
        path: "chat.users",
        select: "name picture email",
      });

      await Chat.findByIdAndUpdate(chatId, { latestMessage: message });
      return res.status(200).json({ success: true, data: message });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error." });
      throw new Error(err.message);
    }
  });
  allMessages = expressAsyncHandler(async (req, res) => {
    try {
      const { chatId } = req.params;
      if (!req.user || !chatId) {
        return res
          .status(400)
          .json({ success: false, message: "Invalid request." });
      }
      const messages = await Message.find({ chat: chatId })
        .populate("sender", "name picture email")
        .populate("chat");
      return res.status(200).json({ success: true, data: messages });
    } catch (err) {
      return res.status(500).json({ success: false, message: "Server error." });
    }
  });
}
