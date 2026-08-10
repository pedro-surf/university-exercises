import express from "express";
import dotenv from 'dotenv';
dotenv.config();
import healthRouter from "./routes/health";
import exercisesRouter from "./routes/exercises";
import exerciseTranslationsRouter from "./routes/exerciseTranslations";
import usersRouter from "./routes/users";
import assetsRouter from "./routes/assets";
import approvalsRouter from "./routes/approvals";

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  res.header(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS"
  );
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

app.use("/health", healthRouter);
app.use("/exercises", exerciseTranslationsRouter);
app.use("/exercises", exercisesRouter);
app.use("/assets", assetsRouter);
app.use("/approvals", approvalsRouter);
app.use("/users", usersRouter);

app.listen(process.env.PORT || 3000);
console.log("Backend started!");