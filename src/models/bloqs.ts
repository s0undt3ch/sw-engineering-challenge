import { load } from "@/utils";

interface Bloq {
  id: string;
  title: string;
  address: string;
}

export function getBloqs() {
  return load("data/bloqs.json") as Bloq[];
}
