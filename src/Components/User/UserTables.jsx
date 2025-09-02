import axios from "axios";
import UserSideBar from "./UserSideBar";

const UserTables = () => {
  return (
    <section className="User-Tables">
      <div className="Wrapper flex flex-wrap">
        <section className="Sidebar">
          <div>
            <UserSideBar />
          </div>
        </section>
        <div>
          <p>Testing</p>
        </div>
      </div>
    </section>
  );
};

export default UserTables;
