import { load } from "@/utils";
import { AppError, HttpCode } from "@/errors";

interface Bloq {
  id: string;
  title: string;
  address: string;
}

export function getBloqs() {
  return load("data/bloqs.json") as Bloq[];
}

export function getBloq(id: string): Bloq {
  const bloqs = getBloqs();
  for (const entry of bloqs) {
    if (entry.id === id) {
      console.log(`Found Match`, entry);
      return entry;
    }
  }
  throw new AppError({
    httpCode: HttpCode.NOT_FOUND,
    description: `Could not find a Bloq by the id of '${id}'`,
  });
}
