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

dotenv.config();

const mockPets = [
  {
    name: "Buddy",
    type: "Dog",
    age: 3,
    location: { lat: 51.5074, lng: -0.1278 },
    city: "London",
    shelterName: "Together",
    phone: "123456789",
    email: "together@gmail.com",
    image: "/images/buddy.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Luci",
    type: "cat",
    age: 3,
    location: { lat: 51.5074, lng: -0.1278 },
    city: "London",
    shelterName: "Together",
    phone: "123456789",
    email: "together@gmail.com",
    image: "/images/luci.jpg",
    gender: "Female",
    favorite: false,
  },
  {
    name: "Tom",
    type: "Cat",
    age: 1,
    location: { lat: 53.483959, lng: -2.244644 },
    city: "Manchester",
    shelterName: "Adoption Centre",
    phone: "123456789",
    email: "adopt@gmail.com",
    image: "/images/tom.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Fluffy",
    type: "Rabbit",
    age: 1,
    location: { lat: 55.9533, lng: -3.1883 },
    city: "Edinburgh",
    sshelterName: "Lives",
    phone: "123456789",
    email: "lives@gmail.com",
    image: "/images/fluffy.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Charlie",
    type: "Dog",
    age: 5,
    location: { lat: 52.4862, lng: -1.8904 },
    city: "Birmingham",
    shelterName: "Bham Pets",
    phone: "123456789",
    email: "bham@gemail.com",
    image: "/images/charlie.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Bella",
    type: "Cat",
    age: 2,
    location: { lat: 51.4545, lng: -2.5879 },
    city: "Bristol",
    shelterName: "Your Pet",
    phone: "123456789",
    email: "your@gmail.com",
    image: "/images/bella.jpg",
    gender: "Female",
    favorite: false,
  },
  {
    name: "Violla",
    type: "Dog",
    age: 4,
    location: { lat: 53.4084, lng: -2.9916 },
    city: "Liverpool",
    shelterName: "Together in Liverpool",
    phone: "123456789",
    email: "togetherliverpool@gmail.com",
    image: "/images/violla.jpg",
    gender: "Female",
    favorite: false,
  },
  {
    name: "Shadow",
    type: "Cat",
    age: 4,
    location: { lat: 51.752, lng: -1.2577 },
    city: "Oxford",
    shelterName: "Save Lives",
    phone: "123456789",
    email: "save@gmail.com",
    image: "/images/shadow.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Snowball",
    type: "Rabbit",
    age: 2,
    location: { lat: 51.4543, lng: -0.9781 },
    city: "Reading",
    shelterName: "The Home",
    phone: "123456789",
    email: "home@gmail.com",
    image: "/images/snowball.jpg",
    gender: "Female",
    favorite: false,
  },
  {
    name: "Rocky",
    type: "Dog",
    age: 5,
    location: { lat: 52.2053, lng: 0.1218 },
    city: "Cambridge",
    shelterName: "The Home Cambridge",
    phone: "123456789",
    email: "homecambridge@gamil.com",
    image: "/images/rocky.jpg",
    gender: "Male",
    favorite: false,
  },
  {
    name: "Ginger",
    type: "Cat",
    age: 3,
    location: { lat: 53.8008, lng: -1.5491 },
    city: "Leeds",
    shelterName: "Shelter",
    phone: "123456789",
    email: "shelter@gamil.com",
    image: "/images/ginger.jpg",
    gender: "Female",
    favorite: false,
  },
];

//middleware
const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection and mock data insertion
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

//routes
app.use("/auth", authRoutes);
app.use("/pets", petRoutes);
app.use("/contact", contactRoutes);
app.use("/dashboard", dashboardRoutes);
app.use("/favorite", favoriteRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
