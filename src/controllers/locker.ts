import { Request, Response } from "express";
import express from "express";
import { getLockers } from "@/models/lockers";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: getLockers(),
  });
});
