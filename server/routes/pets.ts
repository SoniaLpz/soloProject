import express = require("express");
import {
  getAllPets,
  addPet,
  getOnePet,
} from '../controllers/petController';
import authMiddleware from '../middleware/authMiddleware';

const router = express.Router();

router.get("/", getAllPets); // Public access to view pets
router.get("/:id", getOnePet);
router.post("/", authMiddleware, addPet); // Protected route for adding pets

module.exports = router;
