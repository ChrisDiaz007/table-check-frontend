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
    <section className="AppBar">
      <div className="Navbar-Container">
        <div className="FirstSection">
          <img
            src={logo}
            alt="Company logo"
            className="logo"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          />
        </div>
        <div className="SecondSection flex">
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faLocationDot} /> Japan
          </button>
          <button onClick={handleClick} className="UniverseTrigger">
            <FontAwesomeIcon icon={faGlobe} /> EN
          </button>

          {isAuthenticated ? (
            <div className="flex items-center gap-3 ps-3">
              <button
                className="cursor-pointer hover:bg-gray-300 p-2 rounded-md"
                onClick={() => navigate(`/users/${User.id}`)}
              >
                <p>Profile</p>
              </button>
              <button
                className="cursor-pointer bg-black text-white p-2 rounded-md"
                onClick={logout}
              >
                <p>Logout</p>
              </button>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 ps-3">
                <div>
                  <button
                    className="cursor-pointer hover:bg-gray-300 p-2 rounded-md"
                    onClick={() => navigate("/Signup")}
                  >
                    Sign-up
                  </button>
                </div>
                <div>
                  <button
                    className="cursor-pointer bg-black text-white p-2 rounded-md"
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
    </section>
  );
};

export default AppBar;
