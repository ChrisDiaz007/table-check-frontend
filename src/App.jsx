import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import "./App.css";
import AppBar from "./Components/AppBar/AppBar";
import ProtectedRoute from "./Components/routes/ProtectedRoute";
import Login from "./Components/Sessions/Login";
import SearchBar from "./Components/SearchBar/SearchBar";
import Location from "./Components/Content/Location/Location";
import Restaurant from "./Components/Content/Restaurant/Restaurant";
import User from "./Components/User/User";
import RestaurantNew from "./Components/Content/RestaurantNew/RestaurantNew";
import Signup from "./Components/Sessions/Signup";

const AppContent = () => {
  const location = useLocation();

  return (
    <main className="Container">
      {location.pathname === "/" && <SearchBar />}
      <Routes>
        {/* Public route */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Location />} />
        <Route path="/Restaurants/:id" element={<Restaurant />} />
        <Route path="Signup" element={<Signup />} />

        {/* Protected route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/Users/:id" element={<User />} />
          <Route path="/Restaurants/new" element={<RestaurantNew />} />
          {/* <Route path="/" element={<Home />} /> */}
        </Route>
      </Routes>
    </main>
  );
};

const App = () => {
  return (
    <div className="App">
      <Router>
        <header className="App-header">
          <AppBar />
        </header>
        <AppContent />
      </Router>
    </div>
  );
};

export default App;
