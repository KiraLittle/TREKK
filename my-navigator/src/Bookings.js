import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import './Bookings.css';
import logo from './travel bag.png';
import axios from 'axios';

const Bookings = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { departureLocation, destination, departureDate, returnDate, budget } = state || {};

  const [flights, setFlights] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedFlight, setSelectedFlight] = useState(null);
  const [selectedHotel, setSelectedHotel] = useState(null);

  const [chatInput, setChatInput] = useState('');
  const [chat, setChat] = useState([]);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const res = await axios.get('http://localhost:13000/search-flights', {
          params: { origin: departureLocation, destination, departureDate }
        });
        setFlights(res.data.data?.slice(0, 10) || []);
      } catch (err) {
        console.error('Error fetching flights:', err);
      }
    };

    const fetchHotels = async () => {
      try {
        const res = await axios.get('http://localhost:13000/search-hotels', {
          params: { destination, checkInDate: departureDate, checkOutDate: returnDate, budget }
        });
        setHotels(res.data.data?.slice(0, 10) || []);
      } catch (err) {
        console.error('Error fetching hotels:', err);
      }
    };

    if (departureLocation && destination && departureDate && returnDate) {
      fetchFlights();
      fetchHotels();
    }
  }, [departureLocation, destination, departureDate, returnDate, budget]);

  const handleBooking = () => {
    if (!selectedFlight || !selectedHotel) {
      alert('Please select one flight and one hotel.');
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

  const sendChat = async () => {
    if (!chatInput.trim()) return;

    const newMessage = { role: 'user', content: chatInput };
    setChat(prev => [...prev, newMessage]);

    try {
      const res = await axios.post('http://localhost:13000/chat', { message: chatInput });
      const reply = { role: 'assistant', content: res.data.reply };
      setChat(prev => [...prev, reply]);
    } catch (err) {
      console.error('Chat error:', err);
      setChat(prev => [...prev, { role: 'assistant', content: 'Something went wrong.' }]);
    }

    setChatInput('');
  };

  return (
    <div>
      <div className="top-header">
        <div></div>
        <div className="app-title">Trekk</div>
        <img src={logo} alt="logo" className="header-logo" />
      </div>

      <div className="bookings-main">
        <h1>Bookings</h1>
        <button className="back-button" onClick={() => navigate('/info')}>⬅ Go Back</button>

        <div className="bookings-columns">
          <div className="bookings-column">
            <h2>Flights</h2>
            {flights.length === 0 ? <p>No flights found.</p> : flights.map((flight, i) => (
              <div
                key={i}
                className={`option-card ${selectedFlight === flight ? 'selected' : ''}`}
                onClick={() => setSelectedFlight(flight)}
              >
                {flight.itineraries?.[0]?.segments?.[0]?.departure?.iataCode || 'Flight Option'}
              </div>
            ))}
          </div>

          <div className="bookings-column">
            <h2>Hotels</h2>
            {hotels.length === 0 ? <p>No hotels found.</p> : hotels.map((hotel, i) => (
              <div
                key={i}
                className={`option-card ${selectedHotel === hotel ? 'selected' : ''}`}
                onClick={() => setSelectedHotel(hotel)}
              >
                {hotel.hotel?.name || 'Hotel Option'}
              </div>
            ))}
          </div>
        </div>

        <div className="button-stack">
          <button onClick={handleBooking}>Book</button>
        </div>

        <div className="chatbot-container">
          <h3>Need help? Ask Trekk</h3>
          <div className="chat-window">
            {chat.map((msg, index) => (
              <div key={index} className={msg.role === 'user' ? 'chat-user' : 'chat-bot'}>
                <strong>{msg.role === 'user' ? 'You' : 'Trekk'}:</strong> {msg.content}
              </div>
            ))}
          </div>
          <div className="chat-input-row">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask me anything..."
            />
            <button onClick={sendChat}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Bookings;
