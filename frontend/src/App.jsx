import { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import './index.css';
import LoginPage from "./components/LoginPage";
import {RegisterPage} from "./components/RegisterPage";
import HomePage from "./components/HomePage";  // Saját HomePage-ed
import { Toaster } from "sonner";
import { toast } from "sonner";
// API service auth check-hez
import { authService } from "./service/api";  // Módosítsd útvonalat[file:4]

// Login/Register wrapper - JAVÍTVA: switch navigációval
function AuthPages() {
  const [currentPage, setCurrentPage] = useState("register");
  const navigate = useNavigate();

  const handleRegister = (userData) => {
    console.log("✅ Regisztráció:", userData);
    toast.success("Sikeres regisztráció! 👋", {
      description: `${userData.name}, üdv a StudyConnect-en!`,
    });
    setCurrentPage("login");
  };

  const handleLogin = (email, password) => {
    console.log("🔐 Bejelentkezés:", { email, password });
    toast.success("Sikeres bejelentkezés! 📚");
    navigate("/home");  // BEJELENTKEZÉS UTÁN HOME PAGE-RE
  };

  const handleSwitchToLogin = () => {
    setCurrentPage("login");
    navigate("/login");  // JAVÍTVA: navigate hozzáadva
  };

  const handleSwitchToRegister = () => {
    setCurrentPage("register");
    navigate("/register");  // JAVÍTVA: navigate hozzáadva
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {currentPage === "register" ? (
          <RegisterPage 
            onRegister={handleRegister}
            onSwitchToLogin={handleSwitchToLogin}
          />
        ) : (
          <LoginPage 
            onLogin={handleLogin}
            onSwitchToRegister={handleSwitchToRegister}
          />
        )}
      </div>
    </>
  );
}

// JAVÍTOTT: Protected HomePage wrapper auth check-kel
function ProtectedHomePage() {
  const navigate = useNavigate();

  // Auth ellenőrzés: ha nincs token, login-ra dob
  if (!authService.isAuthenticated()) {
    navigate("/login");
    return null;
  }

  return <HomePage />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ProtectedHomePage />} />  {/* VÉDETT FŐOLDAL */}
        <Route path="/home" element={<ProtectedHomePage />} />  {/* VÉDETT LOGIN UTÁN */}
        <Route path="/login" element={<AuthPages />} />
        <Route path="/register" element={<AuthPages />} />
        {/* ÚJ: Search és MyGroups route-ok a HomePage gombjaihoz */}
        <Route path="/search" element={<ProtectedHomePage />} />
        <Route path="/mygroups" element={<ProtectedHomePage />} />
      </Routes>
      <Toaster position="top-right" richColors closeButton />
    </Router>
  );
}

export default App;
