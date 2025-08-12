import './AppBar.css'
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContent';

const AppBar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  const handleClick = () => {
    alert("You clicked");
  };

  return (
    <div className="Desktop-Header">
      <div className="Navbar-Container">
        <div className="FirstSection w-170">
          <img
            src={logo}
            alt="Company logo"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="SecondSection flex-auto">
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faLocationDot} /> Japan
          </button>
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faGlobe} /> EN
          </button>

          { isAuthenticated ? (
            <button onClick={logout}>
              <p>Logout</p>
            </button>
          ) : (
            <button onClick={() => navigate("/login")}>
              <p>Login</p>
            </button>
          )
          }
        </div>
      </div>
    </div>
  )
}

export default AppBar
