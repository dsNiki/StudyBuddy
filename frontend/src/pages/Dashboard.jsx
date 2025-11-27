import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Fab, Avatar } from "@mui/material";
import { logout } from "../redux/slices/authSlice";
import { authService } from "../services/api";
import "./Dashboard.css";
import logo from "../assets/logo_studyBuddy.png";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    authService.logout();
    dispatch(logout());
    navigate("/login");
  };

  const handleAddButton = () => {
    // TODO: Később hozzáadandó funkcionalitás
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const words = name.trim().split(" ");
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleProfileClick = () => {
    // TODO: Később hozzáadandó profil funkcionalitás
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <img src={logo} alt="Study Buddy" className="dashboard-logo" />
        <div>
          <Fab
            size="medium"
            color="primary"
            onClick={handleAddButton}
            sx={{
              width: 50,
              height: 50,
              minWidth: 50,
              minHeight: 50,
              borderRadius: "50%",
              boxShadow: "0 2px 8px rgba(102, 126, 234, 0.3)",
              fontSize: "32px",
              fontWeight: 300,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              lineHeight: 1,
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 4px 12px rgba(102, 126, 234, 0.4)",
              },
            }}
          >
            +
          </Fab>
          <Avatar
            onClick={handleProfileClick}
            sx={{
              width: 50,
              height: 50,
              bgcolor: "#000000",
              color: "#ffffff",
              cursor: "pointer",
              fontSize: "18px",
              fontWeight: 600,
              transition: "all 0.3s ease",
              "&:hover": {
                transform: "scale(1.1)",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.3)",
              },
            }}
          >
            {getInitials(user?.name)}
          </Avatar>
          <button onClick={handleLogout} className="btn btn-logout">
            Kijelentkezés
          </button>
        </div>
      </nav>

      <main className="dashboard-content">
        <h2>Üdvözöllek a Study Buddy-ban!</h2>
        <p>Szak: {user?.major}</p>
        <p>Email: {user?.email}</p>
      </main>
    </div>
  );
};

export default Dashboard;
