import express from "express";
export const healthRouter = express.Router();

healthRouter.get("/", () => {
  console.log("Health Route is working");
});
