import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/auth";
import petRoutes from "./routes/pets";
import contactRoutes from "./routes/contact";
import dashboardRoutes from "./routes/dashboard";
import favoriteRoutes from "./routes/favorite";
import Pet from "./models/pet";
import { mockPets } from "./mockPets.json";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGODB_URI as string)
  .then(async () => {
    console.log("Connected to MongoDB");

    // Insert mock data if the collection is empty
    const existingPets = await Pet.countDocuments();
    if (existingPets === 0) {
      await Pet.insertMany(mockPets);
      console.log("Mock pets data inserted");
    } else {
      console.log("Pets collection already populated");
    }
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/contact", contactRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/favorite", favoriteRoutes);

export default app;
