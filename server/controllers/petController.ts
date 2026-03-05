import { Request, Response } from "express";
import Pet from "../models/pet";

// Get all pets
exports.getAllPets = async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Add a new pet (for shelters)
exports.addPet = async (req: Request, res: Response) => {
  try {
    const newPet = new Pet({
      ...req.body,
      shelter: req.user?.id, // Assuming shelter is logged in
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ error: "Internal Server Error." });
  }
};

//Get one Pet for details
exports.getOnePet = async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pet details" });
  }
};
