import express from "express";
import bloqService from "../services/bloqs.service";
import debug from "debug";

const log: debug.IDebugger = debug("app:bloqs-controller");
class BloqsMiddleware {
  async validateRequiredBloqBodyFields(
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
    if (req.body && req.body.bloqId && req.body.title && req.body.address) {
      next();
    } else {
      res.status(400).send({
        error: `Missing one or more required fields.`,
      });
    }
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
