import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
import { CreateRentDto } from "../../src/rents/dto/create.rent.dto";
import rentsDao from "../../src/rents/daos/rent.dao";

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
});
