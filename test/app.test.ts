import request from "supertest";
import app from "../src/app";
import { describe, test } from "@jest/globals";

describe("App Endpoint Tests", function (): void {
  describe("GET ROUTES", function (): void {
    test("GET / route", function (done): void {
      request(app)
        .get("/")
        .expect(200)
        .expect("Server is running! The api is getting served from '/api'")
        .end(function (err) {
          if (err) return done(err);
          return done();
        });
    });
  });
});
