import express from "express";

import { CommonRoutesConfig } from "../common/common.routes.config";

import BloqsController from "./controllers/bloqs.controller";
import BloqsMiddleware from "./middleware/bloqs.middleware";

export class BloqsRoutes extends CommonRoutesConfig {
  constructor(app: express.Application) {
    super(app, "BloqsRoutes");
  }
  configureRoutes() {
    this.app.route(`/bloqs`).get(BloqsController.listBloqs);

    this.app.post(`/bloqs`, [
      BloqsMiddleware.validateBloqDoesNotExist,
      BloqsController.createBloq,
    ]);

    this.app.param(`bloqId`, BloqsMiddleware.extractBloqId);
    this.app
      .route(`/bloqs/:bloqId`)
      .all(BloqsMiddleware.validateBloqExists)
      .get(BloqsController.getBloqById)
      .delete(BloqsController.removeBloq);

    this.app.put(`/bloqs/:bloqId`, [
      BloqsMiddleware.validateRequiredBloqBodyFields,
      BloqsController.put,
    ]);

    this.app.patch(`/bloqs/:bloqId`, [BloqsController.patch]);

    this.app
      .route(`/bloqs/:bloqId/lockers`)
      .all(BloqsMiddleware.validateBloqExists)
      .get(BloqsController.listBloqLockers);

    return this.app;
  }
}
