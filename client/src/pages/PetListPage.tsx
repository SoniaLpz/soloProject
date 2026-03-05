import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PetCard from "../components/PetCard.jsx";
import type { Pet } from "../types/pet.js";
import type { Filters } from "../types/filters.js";
import MapComponent from "../components/MapComponent.jsx";
import "../styles/PetListPage.css";

const PetListPage = () => {
  const [pets, setPets] = useState<Pet[]>([]);
  const [filters, setFilters] = useState<Filters>({ type: "", city: "", age: ""});

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const response = await axios.get("http://localhost:3000/pets");
        setPets(response.data);
      } catch (error) {
        console.error("Error fetching pets:", error);
      }
    };
    fetchPets();
  }, []);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  //Using the optional chaining operator (?.) ensures that pet.city is defined before calling toLowerCase().
  //If pet.city is undefined, it will safely return undefined, preventing the error.
  const filteredPets = pets.filter((pet) => {
    return (
      (filters.type
        ? pet.type?.toLowerCase() === filters.type.toLowerCase()
        : true) &&
      (filters.city
        ? pet.city?.toLowerCase().includes(filters.city.toLowerCase())
        : true) &&
      (filters.age ? pet.age === parseInt(filters.age) : true)
    );
  });

  return (
    <div className="pet-list-page">
      <MapComponent pets={filteredPets} />

      <h2>Available Pets for Adoption</h2>
      <div className="filter-form">
        <input
          type="text"
          name="type"
          placeholder="Type (e.g., Cat)"
          onChange={handleFilterChange}
        />

        <input
          type="text"
          name="city"
          placeholder="City"
          onChange={handleFilterChange}
        />
        <input
          type="number"
          name="age"
          placeholder="Age"
          onChange={handleFilterChange}
        />
      </div>

      <div className="pet-list">
        {filteredPets.map((pet) => (
          <div key={pet._id}>
            <PetCard key={pet._id} pet={pet} />
            <Link to={`/pets/${pet._id}`}></Link>
          </div>
        ))}
      </div>
      <Link to="/favorite" className="floating-favorites-button">
        \❤️/
      </Link>
    </div>
  );
};

export default PetListPage;
