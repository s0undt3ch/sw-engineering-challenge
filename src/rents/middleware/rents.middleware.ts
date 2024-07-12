import express from "express";
import rentService from "../services/rents.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:rents-controller");
class RentsMiddleware {
  async validateRequiredRentBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.rentId && req.body.title && req.body.address) {
      next();
    } else {
      res.status(400).send({
        error: `Missing one or more required fields.`,
      });
    }
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
          error: `Rent ${req.params.rentId} not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Rent 'rentId' was not passed`,
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
}

export default new RentsMiddleware();
