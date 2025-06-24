import mongoose from "mongoose";

export const AgentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: true,
      unique: true,
    },
    type: {
      type: String,
      enum: ["task", "chat"],
      default: "chat",
    },
    modelProvider: {
      type: String,
      enum: ["gemini", "huggingface", "openrouter"],
      default: "gemini",
    },
    prompt: {
      type: String,
      required: true,
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    apiKey: {
      type: String,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    usageCount: {
      type: Number,
      default: 0,
    },
    temperature: {
      type: Number,
      default: 0.7,
      min: 0,
      max: 1,
    },
    avatar: {
      type: String,
      default: "🤖",
    },
  },
  {
    timestamps: true,
  }
);

export const AgentModel = new mongoose.model("Agent", AgentSchema);
