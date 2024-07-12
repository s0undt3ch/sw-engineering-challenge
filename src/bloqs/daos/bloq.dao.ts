import * as fs from "fs";
import { CreateBloqDto } from "../dto/create.bloq.dto";
import { PutBloqDto } from "../dto/put.bloq.dto";
import { PatchBloqDto } from "../dto/patch.bloq.dto";
import debug from "debug";

const log: debug.IDebugger = debug("app:bloqs:in-memory-dao");

class BloqsDao {
  bloqs: Array<CreateBloqDto> = [];

  constructor() {
    log("Created new instance of BloqsDao");
    this.loadExistingData();
  }

  loadExistingData() {
    log("Loading existing data");
    // const filepath = "../../../data/bloqs.json";
    const filepath = "data/bloqs.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      this.bloqs.push(entry as CreateBloqDto);
    }
  }

  async addBloq(bloq: CreateBloqDto) {
    this.bloqs.push(bloq);
    return bloq.id;
  }

  async getBloqs() {
    return this.bloqs;
  }

  async getBloqById(bloqId: string) {
    return this.bloqs.find((bloq: { id: string }) => bloq.id === bloqId);
  }

  async putBloqById(bloqId: string, bloq: PutBloqDto) {
    const objIndex = this.bloqs.findIndex(
      (obj: { id: string }) => obj.id === bloqId,
    );
    this.bloqs.splice(objIndex, 1, bloq);
    return `${bloq.id} updated via put`;
  }

  async patchBloqById(bloqId: string, bloq: PatchBloqDto) {
    const objIndex = this.bloqs.findIndex(
      (obj: { id: string }) => obj.id === bloqId,
    );
    const currentBloq = this.bloqs[objIndex];
    const allowedPatchFields = ["title", "address"];
    for (const field of allowedPatchFields) {
      if (field in bloq) {
        // @ts-expect-error: Implicit Any
        currentBloq[field] = bloq[field];
      }
    }
    if (currentBloq !== undefined) {
      this.bloqs.splice(objIndex, 1, currentBloq);
      return `${bloq.id} patched`;
    }
    return `${bloq.id} not patched`;
  }

  async removeBloqById(bloqId: string) {
    const objIndex = this.bloqs.findIndex(
      (obj: { id: string }) => obj.id === bloqId,
    );
    this.bloqs.splice(objIndex, 1);
    return `${bloqId} removed`;
  }
}

export default new BloqsDao();
