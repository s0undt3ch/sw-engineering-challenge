import express from "express";
import lockerService from "../services/lockers.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:lockers-controller");
class LockersMiddleware {
  async validateRequiredLockerBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.lockerId && req.body.title && req.body.address) {
      next();
    } else {
      res.status(400).send({
        error: `Missing one or more required fields.`,
      });
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

  async extractLockerId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.lockerId;
    next();
  }
}

export default new LockersMiddleware();
