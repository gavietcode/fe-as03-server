import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, require: true, ref: "User" },
  chatRoomId: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "ChatRoom",
  },
  chatMessages: {
    type: mongoose.Schema.Types.ObjectId,
    require: true,
    ref: "ChatMessage",
  },
  lastActiveTime: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Session", SessionSchema);
