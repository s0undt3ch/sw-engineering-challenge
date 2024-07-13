import express from "express";

// we import our newly created locker services
import lockersService from "../services/lockers.service";

// we use debug with a custom context as described in Part 1
import debug from "debug";

const log: debug.IDebugger = debug("app:lockers-controller");

class LockersController {
  async listLockers(req: express.Request, res: express.Response) {
    const lockers = await lockersService.list(100, 0);
    res.status(200).send(lockers);
  }

  async getLockerById(req: express.Request, res: express.Response) {
    const locker = await lockersService.readById(req.body.id);
    res.status(200).send(locker);
  }

  async createLocker(req: express.Request, res: express.Response) {
    const lockerId = await lockersService.create(req.body);
    res.status(201).send({ id: lockerId });
  }

  async patch(req: express.Request, res: express.Response) {
    log(await lockersService.patchById(req.body.id, req.body));
    res.status(204).send();
  }

  async put(req: express.Request, res: express.Response) {
    log(await lockersService.putById(req.body.id, req.body));
    res.status(204).send();
  }

  async removeLocker(req: express.Request, res: express.Response) {
    log(await lockersService.deleteById(req.body.id));
    res.status(204).send();
  }

  async listLockersByStatus(req: express.Request, res: express.Response) {
    const lockers = await lockersService.listByStatus(req.body.status, 100, 0);
    res.status(200).send(lockers);
  }

  async listLockersByOccupancy(
    occupied: boolean,
    req: express.Request,
    res: express.Response,
  ) {
    const lockers = await lockersService.listByOccupancy(occupied, 100, 0);
    res.status(200).send(lockers);
  }
}

export default new LockersController();
