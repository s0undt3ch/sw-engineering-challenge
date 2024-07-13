import * as fs from "fs";

import { describe, test } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import lockerDao from "../../src/lockers/daos/locker.dao";
import { CreateLockerDto } from "../../src/lockers/dto/create.locker.dto";
import { PutLockerDto } from "../../src/lockers/dto/put.locker.dto";

describe("Lockers Endpoints Tests", function (): void {
  const lockers: CreateLockerDto[] = [];

  beforeAll(function () {
    const filepath = "data/lockers.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      lockers.push(entry as CreateLockerDto);
    }
  });

  beforeEach(function () {
    lockerDao.lockers.length = 0;
    lockerDao.loadExistingData();
  });

  test("GET /lockers has the 3 default records", async function (): Promise<void> {
    const res = await request(app).get("/lockers").send();
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
    expect(res.body.length).toBe(lockers.length);
  });

  test("GET /lockers/<lockerID>", async function (): Promise<void> {
    expect(lockers).not.toHaveLength(0);
    const locker = lockers[0];
    if (locker === undefined) {
      fail("Could not load a Locker");
    }
    const lockerId: string = locker.id;
    const res = await request(app).get(`/lockers/${lockerId}`).send();
    expect(res.status).toBe(200);
    expect(res.body as CreateLockerDto).toEqual(locker);
  });

  test("DELETE /lockers/<lockerID> actually deletes the record", async function (): Promise<void> {
    // TODO: For the sake of SW delivery time, we won't be checking cascade deletes
    expect(lockers).not.toHaveLength(0);
    const locker = lockers[1];
    if (locker === undefined) {
      fail("Could not load a Locker");
    }
    const lockerId: string = locker.id;
    const currentLockerCount = lockers.length;
    const deleteRes = await request(app).delete(`/lockers/${lockerId}`).send();
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount - 1);
  });

  test("GET /lockers/status/open has the 4 records", async function (): Promise<void> {
    const res = await request(app).get("/lockers/status/open").send();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(4);
  });

  test("GET /lockers/status/closed has the 5 records", async function (): Promise<void> {
    const res = await request(app).get("/lockers/status/closed").send();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(5);
  });

  test("GET /lockers/status/<wrong status> errors", async function (): Promise<void> {
    const badStatus = "opens";
    const res = await request(app).get(`/lockers/status/${badStatus}`).send();
    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: `Locker status '${badStatus}' does not exist`,
    });
  });

  test("GET /lockers/occupancy/free has the 6 records", async function (): Promise<void> {
    const res = await request(app).get("/lockers/occupancy/free").send();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(6);
  });

  test("GET /lockers/occupancy/occupied has the 3 records", async function (): Promise<void> {
    const res = await request(app).get("/lockers/occupancy/occupied").send();
    expect(res.status).toBe(200);
    expect(res.body.length).toBe(3);
  });

  test("POST /lockers adds new record", async function (): Promise<void> {
    const currentLockerCount = lockers.length;
    const data = {
      id: "c4705b02-45be-4fd7-8d82-d336df1fa494",
      bloqId: "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
      status: "CLOSED",
      isOccupied: false,
    };
    const postRes = await request(app).post(`/lockers`).send(data);
    expect(postRes.status).toBe(201);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount + 1);
  });

  test("POST /lockers does not allow overriding if ID exists", async function (): Promise<void> {
    expect(lockers).not.toHaveLength(0);
    const locker = lockers[1];
    if (locker === undefined) {
      fail("Could not load a Locker");
    }
    const lockerId: string = locker.id;
    const currentLockerCount = lockers.length;
    const data = {
      id: lockerId,
      bloqId: "22ffa3c5-3a3d-4f71-81f1-cac18ffbc510",
      status: "CLOSED",
      isOccupied: false,
    };
    const postRes = await request(app).post(`/lockers`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount);
  });

  test("POST /lockers fails on non existing bloqId", async function (): Promise<void> {
    const currentLockerCount = lockers.length;
    const data = {
      id: "c4705b02-45be-4fd7-8d82-d336df1fa494",
      bloqId: "22ffa3c5-3a3d-4f71-81f1-cac18ffbc511",
      status: "CLOSED",
      isOccupied: false,
    };
    const postRes = await request(app).post(`/lockers`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount);
  });

  test("PUT /lockers/<lockerID> updates record", async function (): Promise<void> {
    const currentLockerCount = lockers.length;
    expect(lockers).not.toHaveLength(0);
    const locker = lockers[0];
    if (locker === undefined) {
      fail("Could not load a Locker");
    }
    const lockerId: string = locker.id;
    const data = {
      bloqId: locker.bloqId,
      status: "OPEN",
      isOccupied: true,
    };
    const putRes = await request(app).put(`/lockers/${lockerId}`).send(data);
    expect(putRes.status).toBe(204);

    const getRes1 = await request(app).get(`/lockers/${lockerId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body.status).toEqual("OPEN");
    expect(getRes1.body.isOccupied).toEqual(true);

    data["isOccupied"] = false;
    const putRes2 = await request(app).put(`/lockers/${lockerId}`).send(data);
    expect(putRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/lockers/${lockerId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes1.body.status).toEqual("OPEN");
    expect(getRes2.body.isOccupied).toEqual(false);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount);
  });

  test("PATCH /lockers/<lockerID> updates record", async function (): Promise<void> {
    const currentLockerCount = lockers.length;
    expect(lockers).not.toHaveLength(0);
    const locker = lockers[0];
    if (locker === undefined) {
      fail("Could not load a Locker");
    }
    const lockerId: string = locker.id;
    const data1 = {
      status: "OPEN",
    };
    const patchRes1 = await request(app)
      .patch(`/lockers/${lockerId}`)
      .send(data1);
    expect(patchRes1.status).toBe(204);

    const getRes1 = await request(app).get(`/lockers/${lockerId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body.status).toEqual("OPEN");
    expect(getRes1.body.isOccupied).toEqual(true);

    const data2 = {
      isOccupied: false,
    };
    const patchRes2 = await request(app)
      .patch(`/lockers/${lockerId}`)
      .send(data2);
    expect(patchRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/lockers/${lockerId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes1.body.status).toEqual("OPEN");
    expect(getRes2.body.isOccupied).toEqual(false);

    const listRes = await request(app).get("/lockers").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentLockerCount);
  });
});
