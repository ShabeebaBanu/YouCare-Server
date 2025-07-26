import express from "express";
import userController from "./controller/userController.mjs";

const app = express();
app.use(express.json());

app.use("/users", userController);

export default app;