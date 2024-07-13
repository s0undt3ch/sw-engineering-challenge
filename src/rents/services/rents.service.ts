import { CRUD } from "../../common/interfaces/crud.interface";
import RentsDao from "../daos/rent.dao";
import { CreateRentDto } from "../dto/create.rent.dto";
import { PatchRentDto } from "../dto/patch.rent.dto";
import { PutRentDto } from "../dto/put.rent.dto";

class RentsService implements CRUD {
  async create(resource: CreateRentDto) {
    return RentsDao.addRent(resource);
  }

  async deleteById(id: string) {
    return RentsDao.removeRentById(id);
  }

  async list(_limit: number, _page: number) {
    return RentsDao.getRents();
  }

  async patchById(id: string, resource: PatchRentDto) {
    return RentsDao.patchRentById(id, resource);
  }

  async readById(id: string) {
    return RentsDao.getRentById(id);
  }

  async putById(id: string, resource: PutRentDto) {
    return RentsDao.putRentById(id, resource);
  }
}

export default new RentsService();
