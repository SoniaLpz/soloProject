import express from "express";
import {
  getAllFavorites,
  toggleFavoriteStatus,
} from "../controllers/favoriteController";
import authMiddleware from "../middleware/authMiddleware"; // Fix import

const router = express.Router();

// Add pet to favorites
router.post("/:id/toggle", authMiddleware, toggleFavoriteStatus);

// Get user's favorite pets
router.get("/", authMiddleware, getAllFavorites);

export default router;
