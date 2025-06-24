import { configDotenv } from "dotenv";
configDotenv();
export const PORT = process.env.PORT || 3000;
export const mongodb_uri = process.env.MONGODB_URI;
export const DEFAULT_PROFILE_PIC = process.env.DEFAULT_PROFILE_PIC;
