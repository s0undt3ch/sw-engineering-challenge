import { Request, Response } from "express";
import express from "express";
import { getBloqs } from "@/models/bloqs";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: getBloqs(),
  });
});
