import "./UserProfile.css";
import UpdateProfile from "./UpdateProfile";
import UserSideBar from "./UserSideBar";

const UserProfile = () => {
  return (
    <section className="User-Detail">
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
        </section>
      </div>
    </section>
  );
};

export default UserProfile;
