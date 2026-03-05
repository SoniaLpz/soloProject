import { Request, Response } from 'express';
import Pet from '../models/pet'

// Toggle favorite status of a pet
exports.toggleFavoriteStatus = async (req: Request, res: Response) => {
  const { id: petId } = req.params;

  try {
    const pet = await Pet.findById(petId);

    if (!pet) return res.status(404).json({ error: "Pet not found" });

    pet.favorite = !pet.favorite; // Toggle favorite status
    await pet.save();

    res
      .status(200)
      .json({ message: `Favorite status updated to ${pet.favorite}`, pet });
  } catch (error) {
    console.error("Error toggling favorite status:", error);
    res.status(500).json({ error: "Failed to toggle favorite status" });
  }
};

// Get user's favorite pets
exports.getAllFavorites = async (req: Request, res: Response) => {
  try {
    const favoritePets = await Pet.find({ favorite: true });
    res.status(200).json(favoritePets);
  } catch (error) {
    console.error("Error fetching favorite pets:", error);
    res.status(500).json({ error: "Failed to fetch favorite pets" });
  }
};
