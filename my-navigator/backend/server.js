const express = require('express');
const axios = require('axios');
const cors = require('cors');
require('dotenv').config(); // Add dotenv for environment variables

const app = express();
const PORT = process.env.PORT || 13000;

app.use(cors());

// Root Route to prevent "Cannot GET /" Error
app.get('/', (req, res) => {
    res.send('Server is running!');
});

// Function to Get Amadeus (API used) Token (Used for both Flights & Hotels)
async function getAmadeusToken() {
    try {
        const response = await axios.post('https://test.api.amadeus.com/v1/security/oauth2/token', null, {
            params: {
                grant_type: 'client_credentials',
                client_id: process.env.AMADEUS_CLIENT_ID,
                client_secret: process.env.AMADEUS_CLIENT_SECRET,
            },
        });
        return response.data.access_token;
    } catch (error) {
        console.error('Error fetching Amadeus token:', error);
        throw new Error('Failed to fetch Amadeus token');
        // Here to catch any errors while retrieving key
    }
}

// Flight Search Endpoint 
app.get('/search-flights', async (req, res) => {
    const { origin, destination, departureDate } = req.query;
    try {
        const accessToken = await getAmadeusToken();
        const flightSearchResponse = await axios.get(
            'https://test.api.amadeus.com/v2/shopping/flight-offers',
            {
                headers: { Authorization: `Bearer ${accessToken}` },
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
        console.error('Error fetching flight data:', error);
        res.status(500).send('Error fetching flight data');
        // Same as above; Catches errors 
    }
});

// Hotel Search Endpoint Uses Budget input & time frame input
app.get('/search-hotels', async (req, res) => {
    const { destination, budget, checkInDate, checkOutDate } = req.query;
    
    if (!destination || !checkInDate || !checkOutDate) {
        return res.status(400).json({ error: 'Missing required query parameters: destination, checkInDate, checkOutDate' });
        // makes sure user enters information
    
    }

    try {
        const accessToken = await getAmadeusToken();

        const hotelSearchResponse = await axios.get(
            'https://test.api.amadeus.com/v2/shopping/hotel-offers',
            {
                headers: { Authorization: `Bearer ${accessToken}` },
                params: {
                    cityCode: destination, // Destination must be a city code like "NYC"
                    checkInDate,
                    checkOutDate,
                    adults: 1,
                    roomQuantity: 1,
                    priceRange: budget ? `1-${budget}` : undefined, // Filter by budget (if provided)
                },
            }
        );

        res.json(hotelSearchResponse.data);
    } catch (error) {
        console.error('Error fetching hotel data:', error);
        res.status(500).send('Error fetching hotel data');
    }
});

// start express Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
