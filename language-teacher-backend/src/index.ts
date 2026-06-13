import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import healthRouter from "./routes/health";
import exercisesRouter from "./routes/exercises";
import usersRouter from "./routes/users";

const app = express();

app.use(express.json());

app.use("/health", healthRouter);
app.use("/exercises", exercisesRouter);
app.use("/users", usersRouter);

app.listen(3000);