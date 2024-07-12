import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
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
});
