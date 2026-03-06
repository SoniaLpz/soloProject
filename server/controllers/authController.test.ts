import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { login, register } from "./authController";
import User from "../models/user";
import { Request, Response } from "express";

vi.mock("../models/user");

describe("Auth Controller", () => {
  describe.only("Register new user", () => {
    beforeEach(() => {
      vi.clearAllMocks();
    });

    test("returns 201 on successfull registration", async () => {
      (User as unknown as Mock).mockImplementation(function () {
        return {
          save: vi.fn().mockResolvedValue({}),
        };
      });
      const req = {
        body: {
          email: "test@example.com",
          password: "12345",
          role: "adopter",
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
      });
    });

    test("returns 400 when save fails", async () => {
      (User as unknown as Mock).mockImplementation(function () {
        return {
          save: vi.fn().mockRejectedValue(new Error("Database error")),
        };
      });

      const req = {
        body: {
          email: "test@example.com",
          password: "12345",
          role: "adopter",
        },
      } as Request;

      const res = {
        status: vi.fn().mockReturnThis(),
        json: vi.fn(),
      } as unknown as Response;

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User registration failed!",
      });
    });
  });

  describe("Login user", () => {
    test("returns 401 message if no user found", async () => {
      //arrange
      //act
      //assert
    });
    test("returns 401 message if password doesn't match", async () => {
      //arrange
      //act
      //assert
    });
    test("generates token if login is successful", async () => {
      //arrange
      //act
      //assert
    });
    test("returns error message if server error", async () => {
      //arrange
      //act
      //assert
    });
  });
});
