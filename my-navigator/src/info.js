import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './travel bag.png';
import trees from './travel bag (1).png';
import './info.css';

const Info = () => {
  const navigate = useNavigate();
  const [budget, setBudget] = useState('');
  const [departureLocation, setdepartureLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [returnDate, setreturnDate] = useState('');
  const [departureDate, setdepartureDate] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ budget, departureLocation, destination, departureDate, returnDate });
    navigate('/bookings');
  };

  return (
    <div>
      <div className="top-header">
        <div></div>
        <div className="app-title">Trekk</div>
        <img src={logo} alt="logo" className="header-logo" />
      </div>

      <div className="info-header">
        <h1>Let’s plan your trip</h1>
        <p>Fill in your details to get started.</p>

        <form className="info-form" onSubmit={handleSubmit}>
          <div>
            <label>Budget:</label><br />
            <input type="number" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="Enter your budget" required />
          </div>
          <div>
            <label>Departure Location:</label><br />
            <input type="text" value={departureLocation} onChange={(e) => setdepartureLocation(e.target.value)} placeholder="e.g., Baltimore, Maryland" required />
          </div>
          <div>
            <label>Destination:</label><br />
            <input type="text" value={destination} onChange={(e) => setDestination(e.target.value)} placeholder="e.g., Austin, Texas" required />
          </div>
          <div>
            <label>Departure Date:</label><br />
            <input type="text" value={departureDate} onChange={(e) => setdepartureDate(e.target.value)} placeholder="MM/DD/YYYY" required />
          </div>
          <div>
            <label>Return Date:</label><br />
            <input type="text" value={returnDate} onChange={(e) => setreturnDate(e.target.value)} placeholder="MM/DD/YYYY" required />
          </div>

          <div className="button-stack">
            <button type="submit">Submit</button>
            <button type="button" onClick={() => navigate('/')}>Back</button>
          </div>
        </form>

        <img src={trees} alt="logo" className="info-logo-bottom" />
      </div>
    </div>
  );
};

export default Info;
