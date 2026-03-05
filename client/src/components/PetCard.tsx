import "../styles/PetCard.css";
import { Link } from "react-router-dom";
const PetCard = ({ pet }) => {
  return (
    <div className="pet-card">
      <div className="pet-info">
        <Link to={`/pets/${pet._id}`}>
          {pet.image && (
            <img src={pet.image} alt={pet.name} className="pet-image" />
          )}
        </Link>
        <h3>{pet.name}</h3>
      </div>
    </div>
  );
};

export default PetCard;
