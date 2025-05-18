import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightSearchSchema, insertPriceAlertSchema } from "@shared/schema";
import axios from "axios";
import { ZodError } from "zod";
import cron from "node-cron";

// Skyscraper API URL and key
const SKYSCRAPER_API_KEY = process.env.SKYSCRAPER_API_KEY || "demo-key"; 
const SKYSCRAPER_API_URL = "https://api.skyscraper.com/v1"; // Replace with actual API URL

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Fetch flight prices from Skyscraper API
  async function fetchFlightPrices(origin: string, destination: string, date: string) {
    try {
      // This is a placeholder for the actual Skyscraper API call
      const response = await axios.get(`${SKYSCRAPER_API_URL}/flights`, {
        params: {
          api_key: SKYSCRAPER_API_KEY,
          origin,
          destination,
          date,
        },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching flights from Skyscraper API:", error);
      throw error;
    }
  }

  // Mock function to simulate API response while developing
  function simulateSkyscraperApiResponse(origin: string, destination: string, date: string) {
    // Use Indian airlines to match the Indian locations focus
    const airlines = ["Air India", "IndiGo", "SpiceJet", "Vistara", "GoAir", "AirAsia India", "Alliance Air"];
    const flightCount = Math.floor(Math.random() * 10) + 5;
    const flights = [];

    for (let i = 0; i < flightCount; i++) {
      const airline = airlines[Math.floor(Math.random() * airlines.length)];
      // Generate realistic prices in rupees (₹) for Indian flights
      const price = Math.floor(Math.random() * 8000) + 2000; // ₹2000 to ₹10000 range
      const priceChange = Math.floor(Math.random() * 1000) - 500;
      const hours = Math.floor(Math.random() * 3) + 5;
      const minutes = Math.floor(Math.random() * 45);
      const duration = `${hours}h ${minutes}m`;
      const stops = Math.floor(Math.random() * 2);

      // Generate departure and arrival times
      const depHour = Math.floor(Math.random() * 12) + 1;
      const depMinute = Math.floor(Math.random() * 60);
      const depTime = `${depHour.toString().padStart(2, '0')}:${depMinute.toString().padStart(2, '0')} ${depHour < 8 ? 'AM' : 'PM'}`;
      
      const arrHour = (depHour + hours) % 12 || 12;
      const arrMinute = (depMinute + minutes) % 60;
      const arrTime = `${arrHour.toString().padStart(2, '0')}:${arrMinute.toString().padStart(2, '0')} ${(depHour + hours) < 12 ? 'AM' : 'PM'}`;

      flights.push({
        id: i + 1,
        origin,
        destination,
        departureDate: new Date(date),
        airline,
        price,
        priceChange,
        duration,
        stops,
        departureTime: depTime,
        arrivalTime: arrTime,
        lastChecked: new Date(),
      });
    }

    return { flights };
  }

  // Flight search route
  app.get("/api/flights", async (req, res) => {
    try {
      const { origin, destination, minPrice, maxPrice } = req.query;
      
      // Set default date to today if not provided
      const today = new Date().toISOString().split('T')[0];
      
      // Validate query parameters
      const validatedData = flightSearchSchema.parse({
        origin,
        destination,
        minPrice,
        maxPrice,
        departureDate: today, // Use today as default for backend compatibility
      });

      // First check if we have cached flight data
      const cachedFlights = await storage.searchFlights(
        validatedData.origin, 
        validatedData.destination, 
        validatedData.departureDate || today
      );

      if (cachedFlights.length > 0) {
        // Filter flights by price range if specified
        const filteredFlights = cachedFlights.filter(flight => {
          if (validatedData.minPrice && flight.price < validatedData.minPrice) {
            return false;
          }
          if (validatedData.maxPrice && flight.price > validatedData.maxPrice) {
            return false;
          }
          return true;
        });
        
        return res.json({ flights: filteredFlights });
      }

      // In a real implementation, you would call the Skyscraper API here
      // For development, use a simulated response
      // const apiResponse = await fetchFlightPrices(validatedData.origin, validatedData.destination, validatedData.departureDate);
      // Simulate API response with random flights
      const apiResponse = simulateSkyscraperApiResponse(
        validatedData.origin, 
        validatedData.destination, 
        validatedData.departureDate || today
      );
      
      // Filter by price range if specified
      if (validatedData.minPrice || validatedData.maxPrice) {
        apiResponse.flights = apiResponse.flights.filter(flight => {
          if (validatedData.minPrice && flight.price < validatedData.minPrice) {
            return false;
          }
          if (validatedData.maxPrice && flight.price > validatedData.maxPrice) {
            return false;
          }
          return true;
        });
      }

      // Store flight data
      const storedFlights = [];
      for (const flight of apiResponse.flights) {
        const storedFlight = await storage.createFlight(flight);
        storedFlights.push(storedFlight);

        // Also store initial price history
        await storage.addPriceHistory({
          origin: flight.origin,
          destination: flight.destination,
          departureDate: flight.departureDate,
          airline: flight.airline,
          price: flight.price,
          timestamp: new Date(),
        });
      }

      res.json({ flights: storedFlights });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        console.error("Error searching flights:", error);
        res.status(500).json({ message: "Failed to fetch flight data" });
      }
    }
  });

  // Get price history route
  app.get("/api/price-history", async (req, res) => {
    try {
      const { origin, destination } = req.query;
      
      // Set default date to today if not provided
      const today = new Date().toISOString().split('T')[0];
      
      // Validate query parameters
      const validatedData = flightSearchSchema.parse({
        origin,
        destination,
        departureDate: today, // Use today as default for backend compatibility
      });

      const priceHistory = await storage.getPriceHistory(
        validatedData.origin,
        validatedData.destination,
        validatedData.departureDate || today
      );

      // Group price history by airline
      const historyByAirline: Record<string, any[]> = {};
      priceHistory.forEach(record => {
        if (!historyByAirline[record.airline]) {
          historyByAirline[record.airline] = [];
        }
        historyByAirline[record.airline].push({
          price: record.price,
          timestamp: record.timestamp
        });
      });

      // Sort each airline's history by timestamp
      Object.keys(historyByAirline).forEach(airline => {
        historyByAirline[airline].sort((a, b) => 
          new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        );
      });

      res.json({ priceHistory: historyByAirline });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid request parameters", errors: error.errors });
      } else {
        console.error("Error fetching price history:", error);
        res.status(500).json({ message: "Failed to fetch price history" });
      }
    }
  });

  // Create price alert route
  app.post("/api/price-alerts", async (req, res) => {
    try {
      const alertData = insertPriceAlertSchema.parse(req.body);
      
      const priceAlert = await storage.createPriceAlert({
        ...alertData,
        createdAt: new Date(),
      });

      res.status(201).json(priceAlert);
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid alert data", errors: error.errors });
      } else {
        console.error("Error creating price alert:", error);
        res.status(500).json({ message: "Failed to create price alert" });
      }
    }
  });

  // Get price alerts by email
  app.get("/api/price-alerts", async (req, res) => {
    try {
      const { email } = req.query;
      
      if (!email || typeof email !== 'string') {
        return res.status(400).json({ message: "Email is required" });
      }

      const alerts = await storage.getPriceAlertsByEmail(email);
      res.json({ alerts });
    } catch (error) {
      console.error("Error fetching price alerts:", error);
      res.status(500).json({ message: "Failed to fetch price alerts" });
    }
  });

  // Delete/deactivate price alert
  app.delete("/api/price-alerts/:id", async (req, res) => {
    try {
      const alertId = parseInt(req.params.id);
      
      if (isNaN(alertId)) {
        return res.status(400).json({ message: "Invalid alert ID" });
      }

      await storage.deactivatePriceAlert(alertId);
      res.json({ message: "Price alert deactivated successfully" });
    } catch (error) {
      console.error("Error deactivating price alert:", error);
      res.status(500).json({ message: "Failed to deactivate price alert" });
    }
  });

  // Setup a cron job to check for price drops (every hour in a real app)
  // For demo purposes, we'll run it every 5 minutes
  cron.schedule('*/5 * * * *', async () => {
    console.log('Running price alert check...');
    try {
      const activeAlerts = await storage.getPriceAlerts();
      
      for (const alert of activeAlerts) {
        // Check current price
        const flights = await storage.searchFlights(
          alert.origin,
          alert.destination,
          alert.departureDate.toString()
        );
        
        // Find the lowest current price
        const lowestPrice = flights.length > 0 
          ? Math.min(...flights.map(f => f.price)) 
          : Infinity;
        
        // Check if price is below target
        if (lowestPrice <= alert.targetPrice) {
          // In a real app, send email notification here
          console.log(`Price alert triggered for ${alert.email}: ${alert.origin} to ${alert.destination}`);
          console.log(`Current lowest price: $${lowestPrice}, Target: $${alert.targetPrice}`);
          
          // Deactivate the alert after it's triggered
          await storage.deactivatePriceAlert(alert.id);
        }
      }
    } catch (error) {
      console.error('Error checking price alerts:', error);
    }
  });

  return httpServer;
}
