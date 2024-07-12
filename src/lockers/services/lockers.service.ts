import LockersDao from "../daos/locker.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateLockerDto } from "../dto/create.locker.dto";
import { PutLockerDto } from "../dto/put.locker.dto";
import { PatchLockerDto } from "../dto/patch.locker.dto";

class LockersService implements CRUD {
  async create(resource: CreateLockerDto) {
    return LockersDao.addLocker(resource);
  }

  async deleteById(id: string) {
    return LockersDao.removeLockerById(id);
  }

  async list(_limit: number, _page: number) {
    return LockersDao.getLockers();
  }

  async patchById(id: string, resource: PatchLockerDto) {
    return LockersDao.patchLockerById(id, resource);
  }

  async readById(id: string) {
    return LockersDao.getLockerById(id);
  }

  async putById(id: string, resource: PutLockerDto) {
    return LockersDao.putLockerById(id, resource);
  }

  async listByBloqId(bloqId: string, _limit: number, _page: number) {
    return LockersDao.getLockersByBloqId(bloqId);
  }
}

export default new LockersService();
