import express from "express";

import { CommonRoutesConfig } from "../common/common.routes.config";

import LockersController from "./controllers/lockers.controller";
import LockersMiddleware from "./middleware/lockers.middleware";

export class LockersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "LockersRoutes");
  }
  configureRoutes() {
    this.app.route(`/lockers`).get(LockersController.listLockers);

    // WARN: Creating new lockers should be an administrative thing (apparently?)
    this.app.post(`/lockers`, [
      LockersMiddleware.validateLockerDoesNotExist,
      LockersMiddleware.validateRequiredLockerPostBodyFields,
      LockersMiddleware.validateBloqExists,
      LockersController.createLocker,
    ]);

    this.app
      .route(`/lockers/status/:status`)
      .all(LockersMiddleware.extractLockerStatus)
      .get(LockersController.listLockersByStatus);

    this.app.route(`/lockers/occupancy/free`).get(async function (
      req: express.Request,
      res: express.Response,
    ) {
      return await LockersController.listLockersByOccupancy(false, req, res);
    });

    this.app.route(`/lockers/occupancy/occupied`).get(async function (
      req: express.Request,
      res: express.Response,
    ) {
      return await LockersController.listLockersByOccupancy(true, req, res);
    });

    this.app.param(`lockerId`, LockersMiddleware.extractLockerId);
    this.app
      .route(`/lockers/:lockerId`)
      .all(LockersMiddleware.validateLockerExists)
      .get(LockersController.getLockerById)
      .delete(LockersController.removeLocker);

    this.app.put(`/lockers/:lockerId`, [
      LockersMiddleware.validateRequiredLockerPutBodyFields,
      LockersController.put,
    ]);

    this.app.patch(`/lockers/:lockerId`, [LockersController.patch]);

    return this.app;
  }
}
