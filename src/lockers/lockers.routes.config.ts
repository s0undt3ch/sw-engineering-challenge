import { CommonRoutesConfig } from "../common/common.routes.config";
import LockersController from "./controllers/lockers.controller";
import LockersMiddleware from "./middleware/lockers.middleware";
import express from "express";

export class LockersRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "LockersRoutes");
  }
  configureRoutes() {
    this.app.route(`/lockers`).get(LockersController.listLockers);

    this.app
      .route(`/lockers/status/:status`)
      .all(LockersMiddleware.extractLockerStatus)
      .get(LockersController.listLockersByStatus);

    this.app.param(`lockerId`, LockersMiddleware.extractLockerId);
    this.app
      .route(`/lockers/:lockerId`)
      .all(LockersMiddleware.validateLockerExists)
      .get(LockersController.getLockerById)
      .delete(LockersController.removeLocker);

    this.app.put(`/lockers/:lockerId`, [
      LockersMiddleware.validateRequiredLockerBodyFields,
      LockersController.put,
    ]);

    this.app.patch(`/lockers/:lockerId`, [LockersController.patch]);

    return this.app;
  }
}
