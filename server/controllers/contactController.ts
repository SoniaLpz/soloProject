import {Request, Response} from 'express';
import Message from '../models/Message';

exports.submitContactForm = async (req: Request, res: Response) => {
  const { name, email, message } = req.body;
  console.log("Received data:", { name, email, message }); // Log data here

  try {
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.status(200).json({ message: "Message received and saved" });
  } catch (error) {
    console.error("Error saving message:", error);
    res.status(500).json({ error: "Failed to save message" });
  }
};
