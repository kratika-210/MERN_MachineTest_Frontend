import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css"; // Linking the CSS file

const HomePage = () => {
  const navigate = useNavigate();

  const handleStarted = () => {
    navigate("/login");
  };
  return (
    <div className="homepage">
      
      {/* Hero Section */}

      <header className="hero-section">
        <h2>
          Welcome to <span>Employee Management</span> Admin Panel
        </h2>
        <button className="cta-button" onClick={handleStarted}>
          Get Started
        </button>
      </header>

     
      {/* Footer */}
      <footer className="footer">
        <p>© 2024 Employee Management. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
