import mongoose from "mongoose";

export const MessageSchema = new mongoose.Schema(
  {
    chatId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "chat",
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      enum: ["user", "agent"],
      required: true,
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      enum: ["user", "agent"],
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
