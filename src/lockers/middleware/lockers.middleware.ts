import debug from "debug";
import express from "express";

import bloqService from "../../bloqs/services/bloqs.service";
import { LockerStatus } from "../dto/create.locker.dto";
import lockerService from "../services/lockers.service";

const log: debug.IDebugger = debug("app:lockers-controller");
class LockersMiddleware {
  async validateRequiredLockerPostBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const requiredFields = ["id", "bloqId", "status", "isOccupied"];
    const missingFields: string[] = [];
    for (const fieldName of requiredFields) {
      log(`Checking field ${fieldName}: ${req.body[fieldName]}`);
      if (req.body[fieldName] === undefined) {
        missingFields.push(fieldName);
      }
    }
    if (missingFields.length > 0) {
      res.status(400).send({
        error: `Missing one or more required fields: ${missingFields.join(", ")}`,
      });
    } else {
      next();
    }
  }

  async validateRequiredLockerPutBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const requiredFields = ["bloqId", "status", "isOccupied"];
    const missingFields: string[] = [];
    for (const fieldName of requiredFields) {
      log(`Checking field ${fieldName}: ${req.body[fieldName]}`);
      if (req.body[fieldName] === undefined) {
        missingFields.push(fieldName);
      }
    }
    if (missingFields.length > 0) {
      res.status(400).send({
        error: `Missing one or more required fields: ${missingFields.join(", ")}`,
      });
    } else {
      next();
    }
  }

  async validateLockerExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const lockerId = req.params.lockerId;
    log(`Validating Locker by the ID of: ${lockerId}`);
    if (lockerId) {
      const locker = await lockerService.readById(lockerId);
      if (locker) {
        next();
      } else {
        res.status(404).send({
          error: `Locker ${req.params.lockerId} not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Locker 'lockerId' was not passed`,
      });
    }
  }

  async validateLockerDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const lockerId = req.body.id;
    log(`Checking Locker existance by the ID of: ${lockerId}`);
    if (lockerId) {
      const locker = await lockerService.readById(lockerId);
      if (locker) {
        res.status(400).send({
          error: `Locker ${lockerId} already exists`,
        });
      } else {
        next();
      }
    } else {
      res.status(400).send({
        error: `Locker 'id' was not passed`,
      });
    }
  }

  async extractLockerId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.lockerId;
    next();
  }

  async extractLockerStatus(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const statusEnum =
      req.params.status?.toUpperCase() as unknown as LockerStatus;
    const indexOfS = Object.values(LockerStatus).indexOf(statusEnum);
    if (indexOfS === -1) {
      res.status(400).send({
        error: `Locker status '${req.params.status}' does not exist`,
      });
    } else {
      const status: keyof typeof LockerStatus = statusEnum;
      req.body.status = status;
      next();
    }
  }

  async validateBloqExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const bloqId = req.body.bloqId;
    log(`Validating Bloq by the ID of: ${bloqId}`);
    if (bloqId) {
      const bloq = await bloqService.readById(bloqId);
      if (bloq) {
        next();
      } else {
        res.status(400).send({
          error: `Bloq ${req.params.bloqId} not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Bloq 'bloqId' was not passed`,
      });
    }
  }
}

export default new LockersMiddleware();
