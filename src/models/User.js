import mongoose from "mongoose";
import { DEFAULT_PROFILE_PIC } from "../config/envs.js";

export const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    age: {
      type: Number,
      required: true,
      min: [14, "Age must be at least 14"],
      max: [100, "Age cannot exceed 100"],
    },
    bio: {
      type: String,
      maxlength: 300,
      default: "",
    },
    profilePic: {
      type: String,
      default: DEFAULT_PROFILE_PIC,
    },
    educationStatus: {
      type: String,
      enum: ["school", "college", "other"],
      required: true,
    },
    currentCourse: {
      type: String,
      default: "",
    },
    currentYearOrClass: {
      type: String,
      default: "",
    },

    stream: {
      type: String,
      default: "",
    },
    collegeOrSchoolName: {
      type: String,
      default: "",
    },
    reasonToUse: {
      type: [String],
      default: [],
    },
    interests: {
      type: [String], 
      default: [],
    },
    knownProgrammingLanguages: {
      type: [String],
      default: [],
    },
     knownLanguages: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel = new mongoose.model("User", UserSchema);
