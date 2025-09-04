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
import RestaurantNew from "./Components/Content/Restaurant/RestaurantNew";
import Signup from "./Components/Sessions/Signup";
import UserProfile from "./Components/User/UserProfile";
import UserRestaurant from "./Components/User/UserRestaurants";
import RestaurantEdit from "./Components/Content/Restaurant/RestaurantEdit";
import BookingForm from "./Components/Content/Reservations/BookingForm";
import TableNew from "./Components/Content/Tables/TableNew";
import UserTables from "./Components/User/UserTables";
import UserBookings from "./Components/User/UserBookings";

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
          <Route path="/Users/:id" element={<UserProfile />} />
          <Route path="/Restaurants/new" element={<RestaurantNew />} />
          <Route path="/Users/:id/Bookings" element={<UserBookings />} />
          <Route path="/Users/:id/Restaurants" element={<UserRestaurant />} />
          <Route path="/Users/:id/Tables" element={<UserTables />} />
          <Route path="Restaurants/:id/edit" element={<RestaurantEdit />} />
          <Route
            path="Restaurants/:id/reservations"
            element={<BookingForm />}
          />
          <Route path="Restaurants/:id/Tables/new" element={<TableNew />} />
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
