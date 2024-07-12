import BloqsDao from "../daos/bloq.dao";
import { CRUD } from "../../common/interfaces/crud.interface";
import { CreateBloqDto } from "../dto/create.bloq.dto";
import { PutBloqDto } from "../dto/put.bloq.dto";
import { PatchBloqDto } from "../dto/patch.bloq.dto";

class BloqsService implements CRUD {
  async create(resource: CreateBloqDto) {
    return BloqsDao.addBloq(resource);
  }

  async deleteById(id: string) {
    return BloqsDao.removeBloqById(id);
  }

  async list(_limit: number, _page: number) {
    return BloqsDao.getBloqs();
  }

  async patchById(id: string, resource: PatchBloqDto) {
    return BloqsDao.patchBloqById(id, resource);
  }

  async readById(id: string) {
    return BloqsDao.getBloqById(id);
  }

  async putById(id: string, resource: PutBloqDto) {
    return BloqsDao.putBloqById(id, resource);
  }
}

export default new BloqsService();
