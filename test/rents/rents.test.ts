import * as fs from "fs";

import { describe, test } from "@jest/globals";
import request from "supertest";

import app from "../../src/app";
import rentsDao from "../../src/rents/daos/rent.dao";
import { CreateRentDto } from "../../src/rents/dto/create.rent.dto";

describe("Rents Endpoints Tests", function (): void {
  const rents: CreateRentDto[] = [];

  beforeAll(function () {
    const filepath = "data/rents.json";
    const rawData: string = fs.readFileSync(filepath, "utf-8");
    const jsonData = JSON.parse(rawData);
    for (const entry of jsonData) {
      rents.push(entry as CreateRentDto);
    }
  });

  beforeEach(function () {
    rentsDao.rents.length = 0;
    rentsDao.loadExistingData();
  });

  test("GET /rents has the 3 default records", async function (): Promise<void> {
    const res = await request(app).get("/rents").send();
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toEqual(
      expect.stringContaining("json"),
    );
    expect(res.body.length).toBe(rents.length);
  });

  test("GET /rents/<rentID>", async function (): Promise<void> {
    expect(rents).not.toHaveLength(0);
    const rent = rents[0];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const res = await request(app).get(`/rents/${rentId}`).send();
    expect(res.status).toBe(200);
    expect(res.body as CreateRentDto).toEqual(rent);
  });

  test("DELETE /rents/<rentID> actually deletes the record", async function (): Promise<void> {
    // TODO: For the sake of SW delivery time, we won't be checking cascade deletes
    expect(rents).not.toHaveLength(0);
    const rent = rents[0];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const currentRentCount = rents.length;
    const deleteRes = await request(app).delete(`/rents/${rentId}`).send();
    expect(deleteRes.status).toBe(204);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount - 1);
  });

  test("POST /rents adds new record", async function (): Promise<void> {
    const currentRentCount = rents.length;
    const data = {
      id: "84ba232e-ce23-4d8f-ae26-68616600df49",
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 10,
      size: "XL",
      status: "WAITING_DROPOFF",
    };
    const postRes = await request(app).post(`/rents`).send(data);
    expect(postRes.status).toBe(201);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount + 1);
  });

  test("POST /rents does not allow overriding if ID exists", async function (): Promise<void> {
    expect(rents).not.toHaveLength(0);
    const rent = rents[1];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const currentRentCount = rents.length;
    const data = {
      id: rentId,
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 10,
      size: "XL",
      status: "WAITING_DROPOFF",
    };
    const postRes = await request(app).post(`/rents`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });

  test("POST /rents fails on non existing lockerId", async function (): Promise<void> {
    const currentRentCount = rents.length;
    const data = {
      id: "84ba232e-ce23-4d8f-ae26-68616600df49",
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a355",
      weight: 10,
      size: "XL",
      status: "WAITING_DROPOFF",
    };
    const postRes = await request(app).post(`/rents`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });

  test("POST /rents fails on missing required field", async function (): Promise<void> {
    const currentRentCount = rents.length;
    const data = {
      id: "84ba232e-ce23-4d8f-ae26-68616600df49",
      lockerId: "6b33b2d1-af38-4b60-a3c5-53a69f70a351",
      weight: 10,
      size: "XL",
    };
    const postRes = await request(app).post(`/rents`).send(data);
    expect(postRes.status).toBe(400);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });

  test("PUT /rents/<rentID> updates record", async function (): Promise<void> {
    const currentRentCount = rents.length;
    expect(rents).not.toHaveLength(0);
    const rent = rents[0];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const data = {
      id: rentId,
      lockerId: "75f03ea9-c825-4e76-9484-f8b7f0a1d125",
      weight: 10,
      size: "XL",
      status: "WAITING_DROPOFF",
    };
    const putRes = await request(app).put(`/rents/${rentId}`).send(data);
    expect(putRes.status).toBe(204);

    const getRes1 = await request(app).get(`/rents/${rentId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body.status).toEqual("WAITING_DROPOFF");
    expect(getRes1.body.weight).toEqual(10);

    data["status"] = "WAITING_PICKUP";
    const putRes2 = await request(app).put(`/rents/${rentId}`).send(data);
    expect(putRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/rents/${rentId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes2.body.status).toEqual("WAITING_PICKUP");

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });

  test("PUT /rents/<rentID> fails on missing field", async function (): Promise<void> {
    const currentRentCount = rents.length;
    expect(rents).not.toHaveLength(0);
    const rent = rents[0];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const data = {
      id: rentId,
      lockerId: "75f03ea9-c825-4e76-9484-f8b7f0a1d125",
      weight: 10,
      size: "XL",
    };
    const putRes = await request(app).put(`/rents/${rentId}`).send(data);
    expect(putRes.status).toBe(400);

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });

  test("PATCH /rents/<rentID> updates record", async function (): Promise<void> {
    const currentRentCount = rents.length;
    expect(rents).not.toHaveLength(0);
    const rent = rents[0];
    if (rent === undefined) {
      fail("Could not load a Rent");
    }
    const rentId: string = rent.id;
    const data1 = {
      status: "WAITING_DROPOFF",
    };
    const patchRes1 = await request(app).patch(`/rents/${rentId}`).send(data1);
    expect(patchRes1.status).toBe(204);

    const getRes1 = await request(app).get(`/rents/${rentId}`).send();
    expect(getRes1.status).toBe(200);
    expect(getRes1.body.status).toEqual("WAITING_DROPOFF");

    const data2 = {
      status: "WAITING_PICKUP",
    };
    const patchRes2 = await request(app).patch(`/rents/${rentId}`).send(data2);
    expect(patchRes2.status).toBe(204);

    const getRes2 = await request(app).get(`/rents/${rentId}`).send();
    expect(getRes2.status).toBe(200);
    expect(getRes2.body.status).toEqual("WAITING_PICKUP");

    const listRes = await request(app).get("/rents").send();
    expect(listRes.status).toBe(200);
    expect(listRes.body.length).toBe(currentRentCount);
  });
});
