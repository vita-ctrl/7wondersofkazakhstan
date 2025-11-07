import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index.jsx";
import Tours from "./pages/Tours.jsx";
import Layout from "./components/Layout.jsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Index />} />
          <Route path="tours" element={<Tours />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
