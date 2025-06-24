import express from "express";
import cors from "cors";
import { logger } from "./config/loggerConfig.js";
import { DBConnect } from "./config/db/db.js";
import { PORT } from "./config/envs.js";
import { healthRouter } from "./routes/healthRouter.js";
import { UserRouter } from "./routes/userRouter.js";

const app = express();
app.use(
  cors({
    allowedHeaders: true,
    methods: ["*"],
    origin: ["*"],
  })
);
app.use(express.json());

app.use("/api/health", healthRouter);
app.use("/api/user", UserRouter);


app.listen(PORT, () => {
  DBConnect();
  console.info(`Server Started at PORT: ${PORT}`);
  logger.info(`Server Started at PORT: ${PORT}`);
});
