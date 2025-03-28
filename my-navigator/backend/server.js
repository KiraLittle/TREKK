const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for frontend to make requests
app.use(cors());

// Your Amadeus API credentials
const CLIENT_ID = 'YOUR_CLIENT_ID';
const CLIENT_SECRET = 'YOUR_CLIENT_SECRET';

// Endpoint to get the Amadeus token (OAuth 2.0)
app.get('/amadeus-token', async (req, res) => {
  try {
    const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
      params: {
        grant_type: 'client_credentials',
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      },
    });
    res.json(response.data);
  } catch (error) {
    res.status(500).send('Error fetching Amadeus token');
  }
});

// Example endpoint to search for flights
app.get('/search-flights', async (req, res) => {
  const { origin, destination, departureDate } = req.query;
  try {
    const tokenResponse = await axios.post(
      'https://test.api.amadeus.com/v1/security/oauth2/token',
      null,
      {
        params: {
          grant_type: 'client_credentials',
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
        },
      }
    );
    const accessToken = tokenResponse.data.access_token;

    const flightSearchResponse = await axios.get(
      `https://test.api.amadeus.com/v2/shopping/flight-offers`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          originLocationCode: origin,
          destinationLocationCode: destination,
          departureDate: departureDate,
          adults: 1,
        },
      }
    );
    res.json(flightSearchResponse.data);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching flight data');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
