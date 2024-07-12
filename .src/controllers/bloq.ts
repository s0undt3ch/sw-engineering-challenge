import { Request, Response } from "express";
import express from "express";
import { getBloq, getBloqs } from "@/models/bloqs";
import { AppError } from "@/errors";

export const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res.json({
    message: getBloqs(),
  });
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  console.log(`ID: "${id}"`);
  try {
    res.json({
      code: 200,
      message: getBloq(id as string),
    });
  } catch (err) {
    console.log(err);
    if (err instanceof AppError) {
      const error = {
        code: err.httpCode,
        message: err.message,
      };
      console.log(error);
      res.json(error);
    } else {
      res.statusCode = 500;
    }
  }
});
