
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import logo from './travel bag.png';
import './App.css';

const Itinerary = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const destination = location.state?.Bookings || 'Unknown Destination';

  return (
    <div>
      <div className="top-header">
        <div></div>
        <div className="app-title">Trekk</div>
        <img src={logo} alt="logo" className="header-logo" />
      </div>

      <div className="main-section" style={{ flexDirection: 'column' }}>
        <button className="back-button" onClick={() => navigate('/Bookings')}>
           Back to Bookings
        </button>
        <h1>Your Trip to {destination}</h1>
        <p>This is where your custom itinerary will appear based on your selections.</p>
      </div>
    </div>
  );
};

export default Itinerary;
