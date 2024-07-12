import { load } from "../utils";

enum LockerStatus {
  OPEN = "open",
  CLOSED = "closed",
}

interface Locker {
  id: string;
  bloqId: string;
  status: LockerStatus;
  isOccupied: boolean;
}

export function getLockers() {
  return load("data/lockers.json") as Locker[];
}
