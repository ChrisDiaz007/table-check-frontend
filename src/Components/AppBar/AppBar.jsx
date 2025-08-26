import "./AppBar.css";
import logo from "../../assets/logo.svg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faGlobe } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Auth/UseAuth";

const AppBar = () => {
  const navigate = useNavigate();
  const { user: User, isAuthenticated, logout } = useAuth();

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
        <div className="SecondSection flex flex-auto">
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faLocationDot} /> Japan
          </button>
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faGlobe} /> EN
          </button>

          {isAuthenticated ? (
            <>
              <button onClick={() => navigate(`/users/${User.id}`)}>
                <p>Profile</p>
              </button>
              <button onClick={logout}>
                <p>Logout</p>
              </button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div>
                  <button
                    className="cursor-pointer"
                    onClick={() => navigate("/Signup")}
                  >
                    Sign-up
                  </button>
                </div>
                <div>
                  <button
                    className="cursor-pointer"
                    onClick={() => navigate("/login")}
                  >
                    Login
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AppBar;
