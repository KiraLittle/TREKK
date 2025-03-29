const chatRoute = require('./chat');
const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config();


const app = express();
const PORT = process.env.PORT || 13000;

app.use(cors());
app.use(express.json());
app.use('/chat', chatRoute);


let amadeusToken = null;
let tokenExpiryTime = 0;

app.get('/', (req, res) => {
  res.send('Server is running!');
});

async function getAmadeusToken() {
  try {
    if (amadeusToken && Date.now() < tokenExpiryTime) {
      return amadeusToken;
    }

    const response = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_CLIENT_ID,
        client_secret: process.env.AMADEUS_CLIENT_SECRET
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    amadeusToken = response.data.access_token;
    tokenExpiryTime = Date.now() + response.data.expires_in * 1000;

    return amadeusToken;
  } catch (error) {
    console.error('Error fetching Amadeus token:', error.response?.data || error.message);
    throw new Error('Failed to fetch Amadeus token');
  }
}

app.get('/amadeus-token', async (req, res) => {
  try {
    const token = await getAmadeusToken();
    res.json({ access_token: token });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Amadeus API token' });
  }
});

app.get('/search-flights', async (req, res) => {
  const { origin, destination, departureDate } = req.query;

  if (!origin || !destination || !departureDate) {
    return res.status(400).json({ error: 'Missing required query parameters: origin, destination, departureDate' });
  }

  try {
    const accessToken = await getAmadeusToken();

    const flightSearchResponse = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/flight-offers',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate,
          adults: 1,
          max: 10,
          currencyCode: 'USD',
        }
      }
    );

    res.json({ data: flightSearchResponse.data.data });
  } catch (error) {
    console.error('Error fetching flight data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching flight data' });
  }
});

app.get('/search-hotels', async (req, res) => {
  const { destination, checkInDate, checkOutDate, budget } = req.query;

  if (!destination || !checkInDate || !checkOutDate) {
    return res.status(400).json({ error: 'Missing required query parameters: destination, checkInDate, checkOutDate' });
  }

  try {
    const accessToken = await getAmadeusToken();

    const hotelSearchResponse = await axios.get(
      'https://test.api.amadeus.com/v2/shopping/hotel-offers',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
        params: {
          cityCode: destination,
          checkInDate,
          checkOutDate,
          adults: 1,
          roomQuantity: 1,
          priceRange: budget ? `1-${budget}` : undefined,
          currency: 'USD'
        }
      }
    );

    res.json({ data: hotelSearchResponse.data.data });
  } catch (error) {
    console.error('Error fetching hotel data:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error fetching hotel data' });
  }
});

const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

module.exports = app;
