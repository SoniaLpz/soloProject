import { Request, Response } from "express";
import Pet from "../models/pet";

// Get all pets
export const getAllPets = async (req: Request, res: Response) => {
  try {
    const pets = await Pet.find();
    res.json(pets);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

// Add a new pet (for shelters)
export const addPet = async (req: Request, res: Response) => {
  try {
    const newPet = new Pet({
      ...req.body,
      shelter: req.user?.id, // Assuming shelter is logged in
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error." });
  }
};

//Get one Pet for details
export const getOnePet = async (req: Request, res: Response) => {
  try {
    const pet = await Pet.findById(req.params.id);
    res.json(pet);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch pet details" });
  }
};
