import { Request, Response } from "express";
import express from "express";
import { getRents } from "@/models/rents";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: getRents(),
  });
});
