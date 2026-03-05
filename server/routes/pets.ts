import express = require("express");
const {
  getAllPets,
  addPet,
  getOnePet,
} = from("../controllers/petController");
import authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllPets); // Public access to view pets
router.get("/:id", getOnePet);
router.post("/", authMiddleware, addPet); // Protected route for adding pets

module.exports = router;
