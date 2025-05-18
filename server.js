const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Function to generate mock flights with different dates and prices
function generateMockFlights(origin, destination) {
  const airlines = ['IndiGo', 'Air India', 'Vistara', 'SpiceJet', 'GoAir'];
  const flightDurations = {
    'DEL-BOM': '2h 10m',
    'DEL-BLR': '2h 45m',
    'DEL-GOI': '3h 00m',
    'DEL-MAA': '2h 50m',
    'DEL-CCU': '2h 20m',
    'DEL-HYD': '2h 15m',
    'BOM-DEL': '2h 10m',
    'BOM-BLR': '1h 45m',
    'BOM-GOI': '1h 20m',
    'BOM-MAA': '2h 00m',
    'BOM-CCU': '2h 45m',
    'BOM-HYD': '1h 35m',
    'BLR-DEL': '2h 45m',
    'BLR-BOM': '1h 45m',
    'BLR-GOI': '1h 25m',
    'BLR-MAA': '1h 00m',
    'BLR-CCU': '2h 50m',
    'BLR-HYD': '1h 10m',
    'GOI-DEL': '3h 00m',
    'GOI-BOM': '1h 20m',
    'GOI-BLR': '1h 25m',
    'GOI-MAA': '1h 50m',
    'GOI-CCU': '3h 20m',
    'GOI-HYD': '1h 40m'
  };
  
  const routeKey = `${origin}-${destination}`;
  const duration = flightDurations[routeKey] || '2h 30m';
  
  // Base price ranges for different routes (in rupees)
  const basePriceRanges = {
    'DEL-BOM': { min: 3800, max: 6500 },
    'DEL-BLR': { min: 4500, max: 7200 },
    'DEL-GOI': { min: 5200, max: 8500 },
    'DEL-MAA': { min: 4800, max: 7800 },
    'DEL-CCU': { min: 4200, max: 6900 },
    'DEL-HYD': { min: 4000, max: 6700 },
    'BOM-DEL': { min: 3900, max: 6600 },
    'BOM-BLR': { min: 3500, max: 5900 },
    'BOM-GOI': { min: 2500, max: 4500 },
    'BOM-MAA': { min: 3800, max: 6200 },
    'BOM-CCU': { min: 5500, max: 8500 },
    'BOM-HYD': { min: 3200, max: 5500 },
    'BLR-DEL': { min: 4600, max: 7400 },
    'BLR-BOM': { min: 3600, max: 6000 },
    'BLR-GOI': { min: 2800, max: 4800 },
    'BLR-MAA': { min: 2200, max: 3800 },
    'BLR-CCU': { min: 5600, max: 8600 },
    'BLR-HYD': { min: 2500, max: 4200 }
  };
  
  const basePriceRange = basePriceRanges[routeKey] || { min: 4000, max: 7000 };
  
  // Generate dates from today to 30 days ahead
  const today = new Date();
  const flights = [];
  let id = 1;
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // For each date, create 3-5 flights per airline
    airlines.forEach(airline => {
      const numFlights = Math.floor(Math.random() * 3) + 3; // 3-5 flights per airline per day
      
      for (let j = 0; j < numFlights; j++) {
        // Calculate departure time
        const hour = Math.floor(Math.random() * 18) + 6; // 6 AM to 11 PM
        const minute = Math.floor(Math.random() * 60);
        const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        // Calculate arrival time (this is simplified, not accounting for actual flight duration)
        const durationParts = duration.split('h ');
        const durationHours = parseInt(durationParts[0]);
        const durationMinutes = parseInt(durationParts[1].replace('m', ''));
        
        let arrivalHour = hour + durationHours;
        let arrivalMinute = minute + durationMinutes;
        
        if (arrivalMinute >= 60) {
          arrivalHour += 1;
          arrivalMinute -= 60;
        }
        
        while (arrivalHour >= 24) {
          arrivalHour -= 24;
        }
        
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')} ${arrivalHour >= 12 ? 'PM' : 'AM'}`;
        
        // Calculate price with some variation based on date and time
        let basePrice = Math.floor(
          Math.random() * (basePriceRange.max - basePriceRange.min) + basePriceRange.min
        );
        
        // Weekend prices are higher
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          basePrice += Math.floor(basePrice * 0.15); // 15% more on weekends
        }
        
        // Early morning and late night flights are cheaper
        if (hour < 8 || hour > 20) {
          basePrice -= Math.floor(basePrice * 0.1); // 10% discount
        }
        
        // Peak hours are more expensive
        if ((hour >= 8 && hour <= 10) || (hour >= 17 && hour <= 19)) {
          basePrice += Math.floor(basePrice * 0.12); // 12% more during peak hours
        }
        
        // Random price fluctuation
        const priceChange = Math.floor(Math.random() * 600) - 300; // -300 to +300 rupees
        
        // Random number of stops (mostly direct flights)
        const stops = Math.random() < 0.8 ? 0 : 1;
        
        flights.push({
          id: id++,
          origin,
          destination,
          departureDate: dateStr,
          airline,
          price: basePrice,
          priceChange,
          duration,
          stops,
          departureTime,
          arrivalTime,
          lastChecked: new Date()
        });
      }
    });
  }
  
  return flights;
}

// Sample mock flights for API testing if needed
const mockFlights = generateMockFlights('DEL', 'BOM').slice(0, 5);

// Store price alerts
let priceAlerts = [];

// Serve static files
app.use(express.static(path.join(__dirname)));
app.use(express.json());

// API endpoint to search flights by price range
app.get('/api/flights', (req, res) => {
  const { origin, destination, minPrice, maxPrice } = req.query;
  
  // Validate input
  if (!origin || !destination || !minPrice || !maxPrice) {
    return res.status(400).json({
      message: 'Missing required parameters: origin, destination, minPrice, maxPrice'
    });
  }
  
  // Parse price range
  const min = parseInt(minPrice);
  const max = parseInt(maxPrice);
  
  if (isNaN(min) || isNaN(max)) {
    return res.status(400).json({
      message: 'Price values must be numbers'
    });
  }
  
  // Generate more mock flights with different dates for testing
  const allFlights = generateMockFlights(origin.toUpperCase(), destination.toUpperCase());
  
  // Filter flights based on search parameters
  const flights = allFlights.filter(flight => 
    flight.origin === origin.toUpperCase() && 
    flight.destination === destination.toUpperCase() &&
    flight.price >= min && flight.price <= max
  );
  
  // Simulate API delay
  setTimeout(() => {
    res.json({ flights });
  }, 500);
});

// API endpoint to create price alert
app.post('/api/price-alerts', (req, res) => {
  const { origin, destination, departureDate, targetPrice, email } = req.body;
  
  // Validate input
  if (!origin || !destination || !departureDate || !targetPrice || !email) {
    return res.status(400).json({
      message: 'Missing required parameters'
    });
  }
  
  // Create alert object
  const alert = {
    id: Date.now(), // Use timestamp as ID
    origin,
    destination,
    departureDate,
    targetPrice,
    email,
    createdAt: new Date(),
    active: true
  };
  
  // Add to price alerts array
  priceAlerts.push(alert);
  
  res.status(201).json(alert);
});

// API endpoint to get price alerts by email
app.get('/api/price-alerts', (req, res) => {
  const { email } = req.query;
  
  if (!email) {
    return res.status(400).json({
      message: 'Email is required'
    });
  }
  
  const alerts = priceAlerts.filter(alert => alert.email === email && alert.active);
  res.json({ alerts });
});

// API endpoint to deactivate price alert
app.delete('/api/price-alerts/:id', (req, res) => {
  const alertId = parseInt(req.params.id);
  
  if (isNaN(alertId)) {
    return res.status(400).json({
      message: 'Invalid alert ID'
    });
  }
  
  const alertIndex = priceAlerts.findIndex(alert => alert.id === alertId);
  
  if (alertIndex === -1) {
    return res.status(404).json({
      message: 'Alert not found'
    });
  }
  
  priceAlerts[alertIndex].active = false;
  res.json({ message: 'Price alert deactivated successfully' });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});