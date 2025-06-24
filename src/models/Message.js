import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "agent"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const MessageModel = new mongoose.model("Message", MessageSchema);
