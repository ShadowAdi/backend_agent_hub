import express from "express";
import cors from "cors";
import { logger } from "./config/loggerConfig.js";
import { DBConnect } from "./config/db/db.js";
import { PORT } from "./config/envs.js";

const app = express();
app.use(cors());

app.listen(PORT, () => {
  DBConnect();
  console.info(`Server Started at PORT: ${PORT}`);
  logger.info(`Server Started at PORT: ${PORT}`);
});
