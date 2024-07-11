import cors from "cors";
import "dotenv/config";
import express from "express";
import { Request, Response } from "express";
import { router } from "./router";

const app = express();

app.use(cors());
app.get("/", (req: Request, res: Response) => {
  res.send("Server is running! The api is getting served from '/api'");
});
app.use("/api", router);

export default app;
