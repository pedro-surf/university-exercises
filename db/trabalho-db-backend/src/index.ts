import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import helmet from "helmet";
import authController from "./controllers/auth";
import userController from "./controllers/users";
import cursoController from "./controllers/courses";
import projectController from "./controllers/projects";
import eventController from "./controllers/events";
import certificateController from "./controllers/certificates";
import localController from "./controllers/local";
import frequencyController from "./controllers/frequency";
import { sequelize } from "./database";


async function bootstrap() {
  try {
    await sequelize.authenticate();
    console.log("Database connection has been established successfully.");

    const app = express();

    app.use(express.json());
    app.use(cors());
    app.use(helmet());

    app.use(function (_req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length"
      );
      next();
    });

    app.get("/", (_req, res) => {
      res.send("Hello World!");
    });

    app.use("/auth", authController);
    app.use("/users", userController);
    app.use("/courses", cursoController);
    app.use("/certificates", certificateController);
    app.use("/projects", projectController);
    app.use("/events", eventController);
    app.use("/local", localController);
    app.use("/frequency", frequencyController);

    app.listen(process.env.APP_PORT, () => {
      console.log(`Server running on port ${process.env.APP_PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

bootstrap();
