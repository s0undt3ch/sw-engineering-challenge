export enum RentStatus {
  CREATED = "CREATED",
  WAITING_DROPOFF = "WAITING_DROPOFF",
  WAITING_PICKUP = "WAITING_PICKUP",
  DELIVERED = "DELIVERED",
}

export enum RentSize {
  XS = "XS",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL",
}

export interface CreateRentDto {
  id: string;
  lockerId: string;
  weight: number;
  size: RentSize;
  status: RentStatus;
}
