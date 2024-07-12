import { CommonRoutesConfig } from "../common/common.routes.config";
import RentsController from "./controllers/rents.controller";
import RentsMiddleware from "./middleware/rents.middleware";
import express from "express";

export class RentsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "RentsRoutes");
  }
  configureRoutes() {
    this.app.route(`/rents`).get(RentsController.listRents);

    this.app.param(`rentId`, RentsMiddleware.extractRentId);
    this.app
      .route(`/rents/:rentId`)
      .all(RentsMiddleware.validateRentExists)
      .get(RentsController.getRentById)
      .delete(RentsController.removeRent);

    this.app.put(`/rents/:rentId`, [
      RentsMiddleware.validateRequiredRentBodyFields,
      RentsController.put,
    ]);

    this.app.patch(`/rents/:rentId`, [RentsController.patch]);

    return this.app;
  }
}
