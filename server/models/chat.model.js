import mongoose from "mongoose";
// to handle chat
const chatSchema = mongoose.Schema(
  {
    chatName: {
      type: String,
      trim: true,
      required: true,
    },
    isGroupChat: {
      type: Boolean,
      default: false,
    },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },
    groupAdmins: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);
const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
