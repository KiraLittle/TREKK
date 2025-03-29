import React from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import Info from './info';
import Bookings from './Bookings';
import Itinerary from './itinerary';
import logo from './travel bag.png';
import plane from './Plane.svg';
import './App.css';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <div className="top-header">
        <div></div>
        <div className="app-title">Trekk</div>
        <img src={logo} alt="logo" className="header-logo" />
      </div>

      {/* Split layout */}
      <div className="main-section">
        {/* Left */}
        <div className="left-content">
          <div className="left-inner">
            <h1>Welcome to Trekk</h1>
            <p>Your journey starts with a plan.</p>
            <div className="button-stack">
              <button onClick={() => navigate('/info')}>Start Planning</button>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="right-content">
        <img src={plane} alt="planes" className="big-logo" />

        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/info" element={<Info />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/itinerary" element={<Itinerary />} />
      </Routes>
    </Router>
  );
}

export default App;
