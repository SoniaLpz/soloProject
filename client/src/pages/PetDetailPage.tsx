import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/PetDetailPage.css";
import { FaPhone, FaEdit, FaHeart } from "react-icons/fa";
import { BiSolidHomeHeart } from "react-icons/bi";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail, MdDelete } from "react-icons/md";

const PetDetailPage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [cityName, setCityName] = useState(""); // State to store the city name
  const [isFavorite, setIsFavorite] = useState(false); 
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  // Fetch pet details and reverse geocode city name on component mount
  useEffect(() => {
    const fetchPet = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/pets/${id}`);
        setPet(response.data);

        // Check if location coordinates are available
        const { lat, lng } = response.data.location;
        if (lat && lng) {
          const geocodeResponse = await axios.get(
            "https://nominatim.openstreetmap.org/reverse",
            {
              params: {
                lat,
                lon: lng,
                format: "json",
              },
            }
          );
          setCityName(
            geocodeResponse.data.address.city || "Location not available"
          ); // Set the city name
        }

        // Fetch user's favorite pets to check if this pet is a favorite
        const favoritesResponse = await axios.get(
          `http://localhost:3000/favorite`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setIsFavorite(
          favoritesResponse.data.some((favPet) => favPet._id === id)
        );
      } catch (error) {
        console.error("Error fetching pet details:", error);
      }
    };
    fetchPet();
  }, [id, token]);

  // Handler to toggle favorite status
  const handleFavoriteToggle = async () => {
    try {
      const response = await axios.post(
        `http://localhost:3000/favorite/${id}/toggle`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setIsFavorite(response.data.pet.favorite); // Update based on response
    } catch (error) {
      console.error("Error updating favorite status:", error);
    }
  };

  // Loading message while data is being fetched
  if (!pet) return <p>Loading...</p>;

  // Handler for deleting a pet
  const handleDelete = async () => {
    console.log("Deleting pet with id:", id); // Log the id for debugging
    try {
      await axios.delete(`http://localhost:3000/dashboard/pets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      navigate("/dashboard/list");
    } catch (error) {
      console.error("Error deleting pet:", error);
    }
  };

  // Handler for navigating to the edit page
  const handleEdit = () => {
    navigate(`/pets/${id}/edit`);
  };

  return (
    <div className="pet-details">
      <div className="pet-details-info">
        {/* Admin actions - only shown if logged in as a shelter */}
        {token && userRole === "shelter" && (
          <div className="admin-actions">
            <button onClick={handleEdit} className="edit-button">
              <FaEdit size={24} />
            </button>
            <button onClick={handleDelete} className="delete-button">
              <MdDelete size={24} />
            </button>
          </div>
        )}

        {/* Pet details */}
        <h2 id="name">{pet.name}</h2>
        <p>Age: {pet.age}</p>
        <p>Gender: {pet.gender}</p>

        <h4>Shelter Details</h4>
        {/* Display city name from reverse geocoding */}
        <p>
          <FaLocationDot style={{ color: "black", marginRight: "8px" }} />
          {cityName}
        </p>
        <p>
          <BiSolidHomeHeart style={{ color: "black", marginRight: "8px" }} />
          {pet.shelterName}
        </p>
        <p>
          <FaPhone style={{ color: "black", marginRight: "8px" }} />
          {pet.phone}
        </p>
        <p>
          <MdEmail style={{ color: "black", marginRight: "8px" }} />
          {pet.email}
        </p>
      </div>

      {/* Pet image and contact section */}
      <div className="img-and-contact">
        <img src={pet.image} alt={pet.name} className="pet-details-image" />

        {token && userRole === "adopter" && (
          <div className="text">
            <p className="bold">
              <strong>Interested in adopting {pet.name}? Let’s Connect!</strong>
            </p>
            <p className="p1">
              Feel free to reach out in the way that works best for you:
            </p>
            <p className="p2">
              Contact us <Link to="/contact">Here</Link>, drop us an email, or
              give us a call.
            </p>
            <p className="p3">
              We’re here to help make the journey easy and enjoyable.
            </p>
          </div>
        )}

        {/* Favorite button for adopters */}

        {token && userRole === "adopter" && (
          <div>
            <button onClick={handleFavoriteToggle} className="favorite-button">
              {isFavorite ? (
                <FaHeart color="red" size={18} />
              ) : (
                <FaHeart color="grey" size={18} />
              )}
              {isFavorite ? " Unheart This Pet" : " Heart This Pet"}
            </button>
            <Link to="/favorite" className="floating-favorites-button">
              \❤️/
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default PetDetailPage;
