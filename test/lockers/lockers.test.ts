import * as fs from "fs";
import app from "../../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";
import { CreateLockerDto } from "../../src/lockers/dto/create.locker.dto";

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
});
