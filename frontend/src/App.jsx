import { useState } from "react";
import './index.css';
import LoginPage  from "./components/LoginPage";  // ← Itt a te LoginPage komponensed
import { RegisterPage } from "./components/RegisterPage";
import { Toaster } from "sonner";  // ← Toast értesítésekhez szükséges
import { toast } from "sonner";

function App() {
  const [currentPage, setCurrentPage] = useState("register");  // register | login

  const handleRegister = (userData) => {
    console.log("✅ Regisztráció:", userData);
    toast.success("Sikeres regisztráció! 👋", {
      description: `${userData.name}, üdv a StudyConnect-en!`,
    });
    // Opcionális: automatikus login után
    setCurrentPage("login");
  };

  const handleLogin = (email, password) => {
    console.log("🔐 Bejelentkezés:", { email, password });
    toast.success("Sikeres bejelentkezés! 📚", {
      description: "Most már kereshetsz tanulócsoportokat!",
    });
    // Itt történhet a tényleges auth logika (pl. navigate dashboard-ra)
  };

  const handleSwitchToLogin = () => {
    console.log("🔄 Login oldalra váltás");
    setCurrentPage("log");
  };

  const handleSwitchToRegister = () => {
    console.log("🔄 Register oldalra váltás");
    setCurrentPage("register");
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
      
      {/* Toast értesítések globálisan */}
      <Toaster 
        position="top-right"
        richColors
        closeButton
      />
    </>
  );
}

export default App;
