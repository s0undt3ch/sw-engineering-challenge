import debug from "debug";
import express from "express";

const log: debug.IDebugger = debug("app:common-controller");

class CommonMiddleware {
  async validateRequiredBodyFields(
    requiredFields: string[],
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) {
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
}

export default new CommonMiddleware();
