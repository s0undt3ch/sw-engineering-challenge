export enum LockerStatus {
  OPEN = "OPEN",
  CLOSED = "CLOSED",
}

export interface CreateLockerDto {
  id: string;
  bloqId: string;
  status: LockerStatus;
  isOccupied: boolean;
}
