import "../styles/Navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove the token on logout

    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="logo">
      <Link to='/'>
      <h3>PetAdopt</h3>
      </Link>
      </div>
      <div className="nav-links">
        {isLoggedIn ? (
          <button aria-label="Logout" onClick={handleLogout}>
            Logout
          </button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
