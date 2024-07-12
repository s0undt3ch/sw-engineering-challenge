import express from "express";

// we import our newly created rent services
import rentsService from "../services/rents.service";

// we use debug with a custom context as described in Part 1
import debug from "debug";

const log: debug.IDebugger = debug("app:rents-controller");

class RentsController {
  async listRents(req: express.Request, res: express.Response) {
    const rents = await rentsService.list(100, 0);
    res.status(200).send(rents);
  }

  async getRentById(req: express.Request, res: express.Response) {
    const rent = await rentsService.readById(req.body.id);
    res.status(200).send(rent);
  }

  async createRent(req: express.Request, res: express.Response) {
    const rentId = await rentsService.create(req.body);
    res.status(201).send({ id: rentId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await rentsService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await rentsService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeRent(req: express.Request, res: express.Response) {
    log(await rentsService.deleteById(req.body.id));
    res.status(204).send();
  }
}

export default new RentsController();
