const Pet = require("../models/Pet");
const Message = require("../models/Message");

// Fetch all pets (for shelters to manage)
exports.getAllPets = async (req, res) => {
  try {
    const pets = await Pet.find();
    res.status(200).json(pets);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve pets" });
  }
};

// Add a new pet
exports.addPet = async (req, res) => {
  try {
    const newPet = new Pet({
      name: req.body.name,
      type: req.body.type,
      age: req.body.age,
      location: req.body.location,
      image: req.body.image,
      shelter: req.body.shelter,
    });
    await newPet.save();
    res.status(201).json(newPet);
  } catch (error) {
    res.status(400).json({ error: "Failed to add pet" });
  }
};

// Edit an existing pet
exports.editPet = async (req, res) => {
  const { id } = req.params;
  try {
    const updatedPet = await Pet.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(updatedPet);
  } catch (error) {
    res.status(400).json({ error: "Failed to update pet" });
  }
};

exports.deletePet = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedPet = await Pet.findByIdAndDelete(id);
    if (!deletedPet) {
      return res.status(404).json({ message: "Pet not found" });
    }
    res.status(200).json({ message: "Pet deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete pet" });
  }
};

// Fetch all messages
exports.getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve messages" });
  }
};
