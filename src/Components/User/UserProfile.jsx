import "./UserProfile.css";
import { Link } from "react-router-dom";

import UserRestaurants from "./UserRestaurants";
import UpdateProfile from "./UpdateProfile";
import UserSideBar from "./UserSideBar";

const UserProfile = () => {
  return (
    <div className="User-Detail">
      <div className="Account-Page">
        <div className="Wrapper">
          <section className="Sidebar">
            <div>
              <UserSideBar />
            </div>
          </section>
          <section className="User-Content">
            <div>
              <UpdateProfile />
            </div>
            <div>
              <p>My restaurants</p>
              <div>
                <UserRestaurants />
              </div>
            </div>
            <Link to={"/restaurants/new"}>
              <p>New Restaurant</p>
            </Link>
          </section>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
