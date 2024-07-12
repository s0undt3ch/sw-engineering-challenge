import express from "express";

// we import our newly created bloq services
import bloqsService from "../services/bloqs.service";
import lockersService from "../../lockers/services/lockers.service";

// we use debug with a custom context as described in Part 1
import debug from "debug";

const log: debug.IDebugger = debug("app:bloqs-controller");

class BloqsController {
  async listBloqs(req: express.Request, res: express.Response) {
    const bloqs = await bloqsService.list(100, 0);
    res.status(200).send(bloqs);
  }

  async getBloqById(req: express.Request, res: express.Response) {
    const bloq = await bloqsService.readById(req.body.id);
    res.status(200).send(bloq);
  }

  async createBloq(req: express.Request, res: express.Response) {
    const bloqId = await bloqsService.create(req.body);
    res.status(201).send({ id: bloqId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await bloqsService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await bloqsService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeBloq(req: express.Request, res: express.Response) {
    log(await bloqsService.deleteById(req.body.id));
    res.status(204).send();
  }

  async listBloqLockers(req: express.Request, res: express.Response) {
    const bloqs = await lockersService.listByBloqId(req.body.id, 100, 0);
    res.status(200).send(bloqs);
  }
}

export default new BloqsController();
