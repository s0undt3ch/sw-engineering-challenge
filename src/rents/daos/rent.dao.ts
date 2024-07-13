import * as fs from "fs";

import debug from "debug";

import { CreateRentDto } from "../dto/create.rent.dto";
import { PatchRentDto } from "../dto/patch.rent.dto";
import { PutRentDto } from "../dto/put.rent.dto";

const log: debug.IDebugger = debug("app:rents:in-memory-dao");

class RentsDao {
  rents: Array<CreateRentDto> = [];

  constructor() {
    log("Created new instance of RentsDao");
    this.loadExistingData();
  }

  loadExistingData() {
    log("Loading existing data");
    // const filepath = "../../../data/rents.json";
    const filepath = "data/rents.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      this.rents.push(entry as CreateRentDto);
    }
  }

  async addRent(rent: CreateRentDto) {
    this.rents.push(rent);
    return rent.id;
  }

  async getRents() {
    return this.rents;
  }

  async getRentById(rentId: string) {
    return this.rents.find((rent: { id: string }) => rent.id === rentId);
  }

  async putRentById(rentId: string, rent: PutRentDto) {
    const objIndex = this.rents.findIndex(
      (obj: { id: string }) => obj.id === rentId,
    );
    this.rents.splice(objIndex, 1, rent);
    return `${rent.id} updated via put`;
  }

  async patchRentById(rentId: string, rent: PatchRentDto) {
    const objIndex = this.rents.findIndex(
      (obj: { id: string }) => obj.id === rentId,
    );
    const currentRent = this.rents[objIndex];
    const allowedPatchFields = ["lockerId", "weight", "size", "status"];
    for (const field of allowedPatchFields) {
      if (field in rent) {
        // @ts-expect-error: Implicit Any
        currentRent[field] = rent[field];
      }
    }
    if (currentRent !== undefined) {
      this.rents.splice(objIndex, 1, currentRent);
      return `${rent.id} patched`;
    }
    return `${rent.id} not patched`;
  }

  async removeRentById(rentId: string) {
    const objIndex = this.rents.findIndex(
      (obj: { id: string }) => obj.id === rentId,
    );
    this.rents.splice(objIndex, 1);
    return `${rentId} removed`;
  }
}

export default new RentsDao();
