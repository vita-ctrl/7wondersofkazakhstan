import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Index from "./pages/Index.jsx";
import Tours from "./pages/Tours.jsx";
import Login from "./pages/login.jsx";
import Booking from "./pages/Booking.jsx";
import Layout from "./components/Layout.jsx";

import Contacts from "./components/Contacts.jsx";
import NotFoundPage from "./components/NotFound.jsx";

import "./index.css";

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

          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
