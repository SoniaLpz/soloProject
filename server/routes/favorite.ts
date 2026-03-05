import express = require("express");
const {
  getAllFavorites,
  toggleFavoriteStatus,
} = require("../controllers/favoriteController");
import authMiddleware = require("../middleware/authMiddleware"); // Fix import

const router = express.Router();

// Add pet to favorites
router.post("/:id/toggle", authMiddleware, toggleFavoriteStatus);

// Get user's favorite pets
router.get("/", authMiddleware, getAllFavorites);

module.exports = router;
