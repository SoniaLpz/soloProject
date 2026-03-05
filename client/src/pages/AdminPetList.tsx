import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.js";
import "../styles/AdminPetList.css";

const AdminPetList = () => {
  const [pets, setPets] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPet, setNewPet] = useState({
    name: "",
    type: "",
    gender: "",
    shelterName: "",
    phone: "",
    email: "",
    age: "",
    location: "", // This will hold the city name initially
    image: "",
  });
  const [imageFile, setImageFile] = useState(null); // State for the image file
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/dashboard/pets",
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  const handleAddPetClick = () => {
    setShowAddForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPet({ ...newPet, [name]: value });
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  const geocodeCity = async (cityName) => {
    try {
      const response = await axios.get(
        "https://nominatim.openstreetmap.org/search",
        {
          params: {
            q: cityName,
            format: "json",
            limit: 1,
          },
        },
      );
      if (response.data.length > 0) {
        const { lat, lon } = response.data[0];
        return { lat: parseFloat(lat), lng: parseFloat(lon) };
      } else {
        throw new Error("No results found");
      }
    } catch (error) {
      console.error("Error geocoding location:", error);
      return { lat: 0, lng: 0 };
    }
  };

  const handleAddPetSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append("upload_preset", "petAdopt");

      const cloudinaryRes = await axios.post(
        process.env.CLOUDINARY_URL,
        formData,
      );

      const imageUrl = cloudinaryRes.data.secure_url;

      // Geocode the city to get latitude and longitude
      const { lat, lng } = await geocodeCity(newPet.location);
      const newPetData = { ...newPet, location: { lat, lng }, image: imageUrl };

      const response = await axios.post(
        "http://localhost:3000/pets",
        newPetData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setPets([...pets, response.data]);
      setShowAddForm(false);
      setNewPet({
        name: "",
        type: "",
        gender: "",
        shelterName: "",
        phone: "",
        email: "",
        age: "",
        location: "",
        image: "",
      });
      setImageFile(null);
    } catch (error) {
      console.error("Error uploading pet:", error);
    }
  };

  return (
    <div className="Adminpet-list-page">
      {userRole === "shelter" && (
        <button onClick={handleAddPetClick}>New Pet</button>
      )}

      {showAddForm && (
        <form onSubmit={handleAddPetSubmit} className="add-pet-form">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newPet.name}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="type"
            placeholder="Type (e.g., Dog, Cat)"
            value={newPet.type}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="gender"
            placeholder="Gender"
            value={newPet.gender}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="shelterName"
            placeholder="Shelter"
            value={newPet.shelterName}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="phone"
            placeholder="Contact Number"
            value={newPet.phone}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={newPet.email}
            onChange={handleInputChange}
            required
          />
          <input
            type="number"
            name="age"
            placeholder="Age"
            value={newPet.age}
            onChange={handleInputChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="City Name"
            value={newPet.location}
            onChange={handleInputChange}
            required
          />
          <input type="file" name="image" onChange={handleFileChange} />
          <button type="submit">Submit</button>
        </form>
      )}

      <div className="pet-list">
        {pets.map((pet) => (
          <div key={pet._id}>
            <PetCard key={pet._id} pet={pet} />
            <Link to={`/pets/${pet._id}`} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPetList;
