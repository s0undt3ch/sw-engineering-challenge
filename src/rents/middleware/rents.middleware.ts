import debug from "debug";
import express from "express";

import commonMiddleware from "../../common/middleware/common.middleware";
import lockerService from "../../lockers/services/lockers.service";
import rentService from "../services/rents.service";

const log: debug.IDebugger = debug("app:rents-controller");

class RentsMiddleware {
  async validateRequiredRentPostBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    commonMiddleware.validateRequiredBodyFields(
      ["id", "lockerId", "weight", "size", "status"],
      req,
      res,
      next,
    );
  }

  async validateRequiredRentPutBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    commonMiddleware.validateRequiredBodyFields(
      ["lockerId", "weight", "size", "status"],
      req,
      res,
      next,
    );
  }

  async validateRentExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const rentId = req.params.rentId;
    log(`Validating Rent by the ID of: ${rentId}`);
    if (rentId) {
      const rent = await rentService.readById(rentId);
      if (rent) {
        next();
      } else {
        res.status(404).send({
          error: `Rent '${rentId}' not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Rent 'rentId' was not passed`,
      });
    }
  }

  async validateRentDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const rentId = req.body.id;
    log(`Validating Rent by the ID of: ${rentId}`);
    if (rentId) {
      const rent = await rentService.readById(rentId);
      if (rent) {
        res.status(400).send({
          error: `Rent ${rentId} already exists`,
        });
      } else {
        next();
      }
    } else {
      res.status(400).send({
        error: `Rent 'id' was not passed`,
      });
    }
  }

  async extractRentId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.rentId;
    next();
  }

  async validateLockerExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const lockerId = req.body.lockerId;
    log(`Validating Locker by the ID of: ${lockerId}`);
    if (lockerId) {
      const locker = await lockerService.readById(lockerId);
      if (locker) {
        next();
      } else {
        res.status(400).send({
          error: `Locker ${lockerId} not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Locker 'lockerId' was not passed`,
      });
    }
  }
}

export default new RentsMiddleware();
