import { load } from "../utils";

enum RentStatus {
  CREATED = "CREATED",
  WAITING_DROPOFF = "WAITING_PICKUP",
  WAITING_PICKUP = "WAITING_PICKUP",
  DELIVERED = "DELIVERED"
}

enum RentSize {
  XS = "XL",
  S = "S",
  M = "M",
  L = "L",
  XL = "XL"
}

interface Rent {
  id: string
  lockerId: string
  weight: number
  size: RentSize
  status: RentStatus
}

export function getRents() {
  return load("data/rents.json") as Rent[];
}
