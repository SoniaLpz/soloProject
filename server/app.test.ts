import { test, describe, expect, beforeEach, vi } from "vitest";
import request from "supertest";
import app from "./app";

vi.mock("./models/user");
vi.mock("./models/pet");
vi.mock("jsonwebtoken");
vi.mock("bcrypt");

describe("App", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test unknown routes
  // Test that a request to an unknown route returns 404
  describe("Unknown routes", () => {
    test("GET /unknown returns 404", async () => {
      const res = await request(app).get("/unknown");
      expect(res.status).toBe(404);
    });
  });

  // Test protected routes without token
  // Test each protected route to confirm it returns 401 when no token is provided
  describe("Protected routes reject without token", () => {
    test("POST /pets returns 401", async () => {
      //
      const res = await request(app).post("/pets");
      expect(res.status).toBe(401);
    });
    test("GET /dashboard/pets returns 401", async () => {
      const res = await request(app).get("/dashboard/pets");
      expect(res.status).toBe(401);
    });
    test("POST /dashboard/list returns 401", async () => {
      const res = await request(app).post("/dashboard/list");
      expect(res.status).toBe(401);
    });
    test("PUT /dashboard/pets/:id returns 401", async () => {
      const res = await request(app).put("/dashboard/pets/1");
      expect(res.status).toBe(401);
    });
    test("DELETE /dashboard/pets/:id returns 401", async () => {
      const res = await request(app).delete("/dashboard/pets/1");
      expect(res.status).toBe(401);
    });
    test("GET /dashboard/messages returns 401", async () => {
      const res = await request(app).get("/dashboard/messages");
      expect(res.status).toBe(401);
    });
    test("GET /favorite returns 401", async () => {
      const res = await request(app).get("/favorite");
      expect(res.status).toBe(401);
    });
    test("POST /favorite/:id/toggle returns 401", async () => {
      const res = await request(app).post("/favorite/1/toggle");
      expect(res.status).toBe(401);
    });
  });
});
