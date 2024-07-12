import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
import { CreateBloqDto } from "../../src/bloqs/dto/create.bloq.dto";
import bloqDao from "../../src/bloqs/daos/bloq.dao";

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

  beforeEach(function () {
    bloqDao.bloqs.length = 0;
    bloqDao.loadExistingData();
  });

  test("GET /bloqs has the 3 default records", async function (): Promise<void> {
    const res = await request(app).get("/bloqs").send();
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
    expect(res.body.length).toBe(3);
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

  test("DELETE /bloqs/<blockID> actually deletes the record", async function (): Promise<void> {
    // TODO: For the sake of SW delivery time, we won't be checking cascade deletes
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[1];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const currentBloqCount = bloqs.length;
    const deleteRes = await request(app).delete(`/bloqs/${bloqId}`).send();
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app).get("/bloqs").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentBloqCount - 1);
  });

  test("GET /bloqs/<bloqID>/lockers", async function (): Promise<void> {
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[0];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const res = await request(app).get(`/bloqs/${bloqId}/lockers`).send();
    expect(res.status).toBe(200);
    // TODO: We know that each bloq has 3 lockers, however, we should make this test less fragile
    expect(res.body.length).toEqual(3);
  });
});
