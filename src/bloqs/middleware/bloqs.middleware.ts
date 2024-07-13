import debug from "debug";
import express from "express";

import commonMiddleware from "../../common/middleware/common.middleware";
import bloqService from "../services/bloqs.service";

const log: debug.IDebugger = debug("app:bloqs-controller");

class BloqsMiddleware {
  async validateRequiredBloqBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    commonMiddleware.validateRequiredBodyFields(
      ["id", "title", "address"],
      req,
      res,
      next,
    );
  }

  async validateBloqExists(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const bloqId = req.params.bloqId;
    log(`Validating Bloq by the ID of: ${bloqId}`);
    if (bloqId) {
      const bloq = await bloqService.readById(bloqId);
      if (bloq) {
        next();
      } else {
        res.status(404).send({
          error: `Bloq ${req.params.bloqId} not found`,
        });
      }
    } else {
      res.status(400).send({
        error: `Bloq 'bloqId' was not passed`,
      });
    }
  }

  async validateBloqDoesNotExist(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    const bloqId = req.body.id;
    log(`Checking for existing Bloq by the ID of: ${bloqId}`);
    if (bloqId) {
      const bloq = await bloqService.readById(bloqId);
      if (bloq) {
        res.status(400).send({
          error: `Bloq ${req.params.bloqId} already exists`,
        });
      } else {
        next();
      }
    } else {
      res.status(400).send({
        error: `Bloq 'id' was not passed`,
      });
    }
  }

  async extractBloqId(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    req.body.id = req.params.bloqId;
    next();
  }
}

export default new BloqsMiddleware();
