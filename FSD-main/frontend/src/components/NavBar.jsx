import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container">
        <Link to="/" className="navbar-brand">
          Volunteer Connect
        </Link>
        <div className="navbar-nav ms-auto">
          {!user && (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </>
          )}

          {user?.role === "NGO" && (
            <Link to="/ngo-dashboard" className="nav-link">
              NGO Dashboard
            </Link>
          )}

          {user?.role === "User" && (
            <Link to="/user-dashboard" className="nav-link">
              User Dashboard
            </Link>
          )}

          {user && (
            <button onClick={handleLogout} className="btn btn-sm btn-outline-light ms-2">
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
