import express from "express";
import { router as bloqs } from "@/controllers/bloq";
import { router as lockers } from "@/controllers/locker";
import { router as rents } from "@/controllers/rent";

export const router = express.Router();

router.use("/bloqs", bloqs);
router.use("/lockers", lockers);
router.use("/rents", rents);
