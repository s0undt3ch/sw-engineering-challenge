import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
import { CreateBloqDto } from "../../src/bloqs/dto/create.bloq.dto";
import bloqDao from "../../src/bloqs/daos/bloq.dao";
import { PutBloqDto } from "../../src/bloqs/dto/put.bloq.dto";

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

  test("POST /bloqs adds new record", async function (): Promise<void> {
    const currentBloqCount = bloqs.length;
    const data = {
      id: "c3ee858c-f3d8-45a3-803d-e080649bbb6d",
      title: "Riod Eixample 2",
      address: "Pg. de Gràcia, 76, L'Eixample, 08008 Barcelona, Spain",
    };
    const postRes = await request(app).post(`/bloqs`).send(data);
    expect(postRes.status).toBe(201);

    const listRes = await request(app).get("/bloqs").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentBloqCount + 1);
  });

  test("PUT /bloqs/<bloqID> updates record", async function (): Promise<void> {
    const currentBloqCount = bloqs.length;
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[0];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const data = {
      id: bloqId,
      title: "Riod Example 2",
      address: "Pg. de Gràcia, 76, L'Eixample, 08008 Barcelona, Spain",
    };
    const putRes = await request(app).put(`/bloqs/${bloqId}`).send(data);
    expect(putRes.status).toBe(204);

    const getRes1 = await request(app).get(`/bloqs/${bloqId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body as PutBloqDto).toEqual(data);

    data["title"] = "Riod Example 3";
    const putRes2 = await request(app).put(`/bloqs/${bloqId}`).send(data);
    expect(putRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/bloqs/${bloqId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes2.body as PutBloqDto).toEqual(data);
    expect(getRes2.body.title).toEqual("Riod Example 3");

    const listRes = await request(app).get("/bloqs").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentBloqCount);
  });

  test("PATCH /bloqs/<bloqID> updates record", async function (): Promise<void> {
    const currentBloqCount = bloqs.length;
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[0];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const data1 = {
      title: "Riod Example 2",
    };
    const patchRes = await request(app).patch(`/bloqs/${bloqId}`).send(data1);
    expect(patchRes.status).toBe(204);

    const getRes1 = await request(app).get(`/bloqs/${bloqId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body.title).toEqual(data1["title"]);

    const data2 = {
      address: "Pg. de Gràcia, 76, L'Eixample, 08008 Barcelona, Spain",
    };

    const patchRes2 = await request(app).patch(`/bloqs/${bloqId}`).send(data2);
    expect(patchRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/bloqs/${bloqId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes2.body.address).toEqual(data2["address"]);

    const listRes = await request(app).get("/bloqs").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentBloqCount);
  });

  test("POST /bloqs does not allow overriding if ID exists", async function (): Promise<void> {
    expect(bloqs).not.toHaveLength(0);
    const bloq = bloqs[1];
    if (bloq === undefined) {
      fail("Could not load a Bloq");
    }
    const bloqId: string = bloq.id;
    const currentBloqCount = bloqs.length;
    const data = {
      id: bloqId,
      title: "Riod Eixample 2",
      address: "Pg. de Gràcia, 76, L'Eixample, 08008 Barcelona, Spain",
    };
    const postRes = await request(app).post(`/bloqs`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/bloqs").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentBloqCount);
  });

  test("DELETE /bloqs/<bloqID> actually deletes the record", async function (): Promise<void> {
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
