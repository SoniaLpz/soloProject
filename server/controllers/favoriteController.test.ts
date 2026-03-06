import { Request, Response } from "express";
import Pet from "../models/pet";
import { toggleFavoriteStatus, getAllFavorites } from "./favoriteController";
import { vi, describe, test, expect, beforeEach, Mock } from "vitest";

vi.mock("../models/pet");

const mockPet = {
  id: "1",
  name: "Buddy",
  type: "Dog",
};

const mockRes = () =>
  ({
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  }) as unknown as Response;

describe.only("Favorite Controller", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Toggle Favorite Status", () => {
    test("should toggle favorite status of a pet", async () => {
      const saveMock = vi.fn().mockResolvedValue({});
      (Pet.findById as Mock).mockResolvedValue({
        ...mockPet,
        favorite: false,
        save: saveMock,
      });

      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockRes();

      await toggleFavoriteStatus(req, res);

      expect(Pet.findById).toHaveBeenCalledWith("1");
      expect(saveMock).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "Favorite status updated to true",
        pet: { ...mockPet, favorite: true, save: saveMock },
      });
    });
    test("should return 4040 if pet not found", async () => {
      (Pet.findById as Mock).mockResolvedValue(null); // No pet found

      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockRes();

      await toggleFavoriteStatus(req, res);

      expect(Pet.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Pet not found" });
    });
    test("should return 500 if there's a server error", async () => {
      (Pet.findById as Mock).mockRejectedValue(new Error("Database error")); // Simulate DB error

      const req = { params: { id: "1" } } as unknown as Request;
      const res = mockRes();

      await toggleFavoriteStatus(req, res);

      expect(Pet.findById).toHaveBeenCalledWith("1");
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to toggle favorite status",
      });
    });
  });

  describe("Get All Favorites", () => {
    test("should return all favorite pets", async () => {
      const favoritePets = [
        { ...mockPet, favorite: true },
        { id: "2", name: "Mittens", type: "Cat", favorite: true },
      ];
      (Pet.find as Mock).mockResolvedValue(favoritePets);
    });
  });
});
