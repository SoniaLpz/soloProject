import { describe, test, expect, vi, beforeEach, Mock } from "vitest";
import { login, register } from "./authController";
import User from "../models/user";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

vi.mock("../models/user");
vi.mock("jsonwebtoken");
vi.mock("bcrypt");

const mockUser = {
  _id: "1",
  role: "adopter",
  email: "test@example.com",
  password: "hashedpassword",
};

const mockRes = () =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }) as unknown as Response;

describe("Auth Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Register new user", () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "12345",
        role: "adopter",
      },
    } as Request;

    test("returns 201 on successfull registration", async () => {
      (User as unknown as Mock).mockImplementation(function () {
        return {
          save: vi.fn().mockResolvedValue({}),
        };
      });

      const res = mockRes();
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

      const res = mockRes();

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "User registration failed!",
      });
    });
  });

  describe("Login user", () => {
    const req = {
      body: {
        email: "test@example.com",
        password: "hashedpassword",
      },
    } as Request;

    beforeEach(() => {
      process.env.JWT_SECRET = "supersecret";
    });

    test("returns token on successful login", async () => {
      (User.findOne as Mock).mockResolvedValue(mockUser); //returns user object
      (bcrypt.compare as Mock).mockResolvedValue(true); //checks if password matches
      (jwt.sign as Mock).mockReturnValue("new.token.here"); //returns token

      const res = mockRes();

      await login(req, res);

      expect(jwt.sign).toHaveBeenCalledWith(
        { id: mockUser._id, role: mockUser.role },
        expect.any(String), //secret
        expect.any(Object), //expiry time
      );
      expect(res.json).toHaveBeenCalledWith({
        token: "new.token.here",
        role: mockUser.role,
      });
    });
    test("returns 401 message if password is incorrect", async () => {
      (User.findOne as Mock).mockResolvedValue(mockUser); //returns user object
      (bcrypt.compare as Mock).mockResolvedValue(false); //password does not match

      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });

    test("returns 401 message if user not found", async () => {
      (User.findOne as Mock).mockResolvedValue(null); //returns null for user not found

      const res = mockRes();

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid credentials",
      });
    });

    test("returns error message if server error", async () => {
      (User.findOne as Mock).mockRejectedValue(new Error("Server error"));
      const res = mockRes();
      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Server error",
      });
    });
  });
});
