import express from "express";
import {
  getAllPets,
  addPet,
  editPet,
  deletePet,
  getAllMessages,
} from "../controllers/adminController";
import authMiddleware from "../middleware/authMiddleware";

const router = express.Router();
// Pet routes
router.get("/pets", authMiddleware, getAllPets);
router.post("/list", authMiddleware, addPet);
router.put("/pets/:id", authMiddleware, editPet);
router.delete("/pets/:id", authMiddleware, deletePet);

// Message routes
router.get("/messages", authMiddleware, getAllMessages);

export default router;
