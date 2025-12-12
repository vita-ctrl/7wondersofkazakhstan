import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Tours from "./pages/Tours.jsx";
import Login from "./pages/login.jsx";
import Booking from "./pages/Booking.jsx";
import Profile from "./pages/Profile.jsx"; // Импорт профиля
import Layout from "./components/Layout.jsx";
import Contacts from "./components/Contacts.jsx";
import NotFoundPage from "./components/NotFound.jsx";
import { getToken } from "./utils/auth"; // Импорт функции проверки токена

import "./index.css";

// Защищенный маршрут
const ProtectedRoute = ({ children }) => {
  const token = getToken();
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />

          <Route path="tours" element={<Tours />} />
          <Route path="tours/:tourId" element={<Tours />} />

          <Route path="booking/:tourId" element={<Booking />} />

          <Route path="contacts" element={<Contacts />} />
          <Route path="login" element={<Login />} />
          
          {/* Добавьте этот маршрут */}
          <Route 
            path="profile" 
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            } 
          />

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);