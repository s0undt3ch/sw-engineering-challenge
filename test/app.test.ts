import app from "../src/app";
import request from "supertest";
import { describe, test } from "@jest/globals";

describe("App Endpoints Tests", function (): void {
  describe("GET ROUTES", function (): void {
    test("GET /", async function (): Promise<void> {
      const res = await request(app).get("/").send();

      expect(res.status).toBe(200);
    });
  });
});
