import * as fs from "fs";
import { CreateLockerDto, LockerStatus } from "../dto/create.locker.dto";
import { PutLockerDto } from "../dto/put.locker.dto";
import { PatchLockerDto } from "../dto/patch.locker.dto";
import debug from "debug";

const log: debug.IDebugger = debug("app:lockers:in-memory-dao");

class LockersDao {
  lockers: Array<CreateLockerDto> = [];

  constructor() {
    log("Created new instance of LockersDao");
    this.loadExistingData();
  }

  loadExistingData() {
    log("Loading existing data");
    // const filepath = "../../../data/lockers.json";
    const filepath = "data/lockers.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      this.lockers.push(entry as CreateLockerDto);
    }
  }

  async addLocker(locker: CreateLockerDto) {
    this.lockers.push(locker);
    return locker.id;
  }

  async getLockers() {
    return this.lockers;
  }

  async getLockerById(lockerId: string) {
    return this.lockers.find(
      (locker: { id: string }) => locker.id === lockerId,
    );
  }

  async putLockerById(lockerId: string, locker: PutLockerDto) {
    const objIndex = this.lockers.findIndex(
      (obj: { id: string }) => obj.id === lockerId,
    );
    this.lockers.splice(objIndex, 1, locker);
    return `${locker.id} updated via put`;
  }

  async patchLockerById(lockerId: string, locker: PatchLockerDto) {
    const objIndex = this.lockers.findIndex(
      (obj: { id: string }) => obj.id === lockerId,
    );
    const currentLocker = this.lockers[objIndex];
    const allowedPatchFields = ["title", "address"];
    for (const field of allowedPatchFields) {
      if (field in locker) {
        // @ts-expect-error: Implicit Any
        currentLocker[field] = locker[field];
      }
    }
    if (currentLocker !== undefined) {
      this.lockers.splice(objIndex, 1, currentLocker);
      return `${locker.id} patched`;
    }
    return `${locker.id} not patched`;
  }

  async removeLockerById(lockerId: string) {
    const objIndex = this.lockers.findIndex(
      (obj: { id: string }) => obj.id === lockerId,
    );
    this.lockers.splice(objIndex, 1);
    return `${lockerId} removed`;
  }

  async getLockersByBloqId(bloqId: string) {
    return this.lockers.filter((locker) => locker.bloqId === bloqId);
  }

  async getLockersByStatus(status: LockerStatus) {
    return this.lockers.filter((locker) => locker.status === status);
  }

  async getLockersByOccupancy(occupied: boolean) {
    return this.lockers.filter((locker) => locker.isOccupied === occupied);
  }
}

export default new LockersDao();
