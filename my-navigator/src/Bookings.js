import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Bookings.css';
import logo from './travel bag.png';

const Bookings = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const {
    budget,
    departureLocation,
    destination,
    departureDate,
    returnDate
  } = state || {};

  // Mock data (you'll replace with real API data later)
  const flights = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Flight ${i + 1} from ${departureLocation} to ${destination}`,
    date: departureDate
  }));

  const hotels = Array.from({ length: 10 }, (_, i) => ({
    id: i + 1,
    name: `Hotel ${i + 1} in ${destination}`,
    dates: `${departureDate} - ${returnDate}`
  }));

  const handleBooking = () => {
    if (!selectedFlight || !selectedHotel) {
      alert('Please select one flight and one hotel before booking.');
      return;
    }

    navigate('/itinerary', {
      state: {
        flight: selectedFlight,
        hotel: selectedHotel,
        budget,
        departureLocation,
        destination,
        departureDate,
        returnDate
      }
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="top-header">
        <div></div>
        <div className="app-title">Trekk</div>
        <img src={logo} alt="logo" className="header-logo" />
      </div>

      <div className="bookings-main">
        <div className="bookings-header">
          <h1>Bookings</h1>
          <button className="back-button" onClick={() => navigate('/info')}>
            ⬅ Go Back
          </button>
        </div>

        <div className="bookings-columns">
          <div className="bookings-column">
            <h2>Flights</h2>
            {flights.map((flight) => (
              <div
                key={flight.id}
                className={`option-card ${selectedFlight?.id === flight.id ? 'selected' : ''}`}
                onClick={() => setSelectedFlight(flight)}
              >
                {flight.name} — {flight.date}
              </div>
            ))}
          </div>

          <div className="bookings-column">
            <h2>Hotels</h2>
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className={`option-card ${selectedHotel?.id === hotel.id ? 'selected' : ''}`}
                onClick={() => setSelectedHotel(hotel)}
              >
                {hotel.name} — {hotel.dates}
              </div>
            ))}
          </div>
        </div>

        <div className="button-stack">
          <button onClick={handleBooking}>Book</button>
        </div>
      </div>
    </div>
  );
};

export default Bookings;