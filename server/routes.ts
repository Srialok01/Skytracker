import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { flightSearchSchema, insertPriceAlertSchema } from "@shared/schema";
import axios from "axios";
import { ZodError } from "zod";
import cron from "node-cron";

const SKYSCANNER_API_KEY = "bf3c135da3msh6952221c554c73cp17d2a3jsnfbdcbceb0dc8";
const SKYSCANNER_API_URL = "https://sky-scrapper.p.rapidapi.com/api/v1/flights";

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // Fetch real flight data from Skyscanner API
  async function fetchFlights(origin: string, destination: string, date: string) {
    try {
      const response = await axios.get(`${SKYSCANNER_API_URL}/getPriceCalendar`, {
        headers: {
          'X-RapidAPI-Key': SKYSCANNER_API_KEY,
          'X-RapidAPI-Host': 'sky-scrapper.p.rapidapi.com'
        },
        params: {
          originSkyId: 'VNS',
          destinationSkyId: 'HYD', 
          fromDate: '2025-05-18',
          currency: 'INR'
        }
      });

      const flightData = response.data.data.flights;
      if (!flightData || !flightData.days || !Array.isArray(flightData.days)) {
        return [];
      }

      // Get price group labels mapping
      const priceLabels = flightData.groups.reduce((acc, group) => {
        acc[group.id] = group.label;
        return acc;
      }, {});

      return flightData.days.map(flight => ({
        id: Math.random().toString(36).substr(2, 9),
        origin,
        destination,
        airline: 'Multiple Airlines',
        departureDate: flight.day,
        departureTime: `${flight.day}T00:00:00`,
        arrivalTime: `${flight.day}T23:59:59`,
        duration: 24 * 60, // 24 hours in minutes
        price: Math.round(flight.price * 100) / 100,
        stops: 0,
        priceGroup: priceLabels[flight.group] || flight.group,
        priceCategory: flight.group
      }));
    } catch (error) {
      console.error("Error fetching from Skyscanner:", error);
      throw error;
    }
  }

  app.get("/api/flights", async (req, res) => {
    try {
      const validatedData = flightSearchSchema.parse(req.query);
      const flights = await fetchFlights(
        validatedData.origin,
        validatedData.destination,
        validatedData.departureDate || new Date().toISOString().split('T')[0]
      );

      // Filter by price range if specified
      const filteredFlights = flights.filter(flight => {
        if (validatedData.minPrice && flight.price < validatedData.minPrice) return false;
        if (validatedData.maxPrice && flight.price > validatedData.maxPrice) return false;
        return true;
      });

      res.json({ flights: filteredFlights });
    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).json({ message: "Invalid search parameters", errors: error.errors });
      } else {
        res.status(500).json({ message: "Error fetching flights" });
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