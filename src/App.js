import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignIn from "./Auth/SignIn";
import ProtectedRoute from "./Auth/ProtectedRoute";

import MainLayout from "./Layout/MainLayout";
import Dashboard from "./Dashboard/Dashboard.js";
import Room from "./Room/Room.js";
import Staff from "./Staff/Staff.js";
import Booking from "./Booking/Booking.js";
import Guest from "./Guest/Guest.js";
import Discount from "./Discount/Discount.js";
import Finance from "./Finance/Finance.js";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/sign-in" element={<SignIn />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <MainLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="room" element={<Room />} />
          <Route path="staff" element={<Staff />} />
          <Route path="booking" element={<Booking />} />
          <Route path="guest" element={<Guest />} />
          <Route path="discount" element={<Discount />} />
          <Route path="finance" element={<Finance />} />
        </Route>
        <Route path="*" element={<Navigate to="/sign-in" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;