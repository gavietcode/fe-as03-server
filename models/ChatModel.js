import mongoose from "mongoose";
const ChatSchema = new mongoose.Schema(
  {
    members: { type: Array },
  },
  { timestamps: true }
);

const ChatModel = mongoose.model("Chat", ChatSchema);
export default ChatModel;

// Add a member to the chat room
