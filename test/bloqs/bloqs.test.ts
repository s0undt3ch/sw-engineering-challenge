import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
import { CreateBloqDto } from "../../src/bloqs/dto/create.bloq.dto";

describe("Bloqs Endpoints Tests", function (): void {
  const bloqs: CreateBloqDto[] = [];

  beforeAll(function () {
    const filepath = "data/bloqs.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      bloqs.push(entry as CreateBloqDto);
    }
  });

  test("GET /bloqs has the 3 default records", async function (): Promise<void> {
    const res = await request(app).get("/bloqs").send();
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
    expect(res.body.length).toBe(bloqs.length);
  });

  test("GET /bloqs/<bloqID>", async function (): Promise<void> {
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[0];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const res = await request(app).get(`/bloqs/${bloqId}`).send();
    expect(res.status).toBe(200);
    expect(res.body as CreateBloqDto).toEqual(bloq);
  });
});
