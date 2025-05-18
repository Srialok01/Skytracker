import { pgTable, text, serial, integer, boolean, timestamp, date } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users schema
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  email: text("email").notNull().unique(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  email: true,
});

// Flights schema
export const flights = pgTable("flights", {
  id: serial("id").primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: date("departure_date").notNull(),
  airline: text("airline").notNull(),
  price: integer("price").notNull(),
  duration: text("duration").notNull(),
  stops: integer("stops").notNull(),
  departureTime: text("departure_time").notNull(),
  arrivalTime: text("arrival_time").notNull(),
  lastChecked: timestamp("last_checked").notNull(),
  priceChange: integer("price_change"),
});

export const insertFlightSchema = createInsertSchema(flights).omit({
  id: true,
});

// Price alerts schema
export const priceAlerts = pgTable("price_alerts", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: date("departure_date").notNull(),
  targetPrice: integer("target_price").notNull(),
  email: text("email").notNull(),
  createdAt: timestamp("created_at").notNull(),
  active: boolean("active").notNull().default(true),
});

export const insertPriceAlertSchema = createInsertSchema(priceAlerts).omit({
  id: true,
  createdAt: true,
});

// Price history schema
export const priceHistory = pgTable("price_history", {
  id: serial("id").primaryKey(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  departureDate: date("departure_date").notNull(),
  airline: text("airline").notNull(),
  price: integer("price").notNull(),
  timestamp: timestamp("timestamp").notNull(),
});

export const insertPriceHistorySchema = createInsertSchema(priceHistory).omit({
  id: true,
});

// Flight search schema (not stored in DB, used for validation)
export const flightSearchSchema = z.object({
  origin: z.string().min(3).max(3),
  destination: z.string().min(3).max(3),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  departureDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});

// Types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertFlight = z.infer<typeof insertFlightSchema>;
export type Flight = typeof flights.$inferSelect;

export type InsertPriceAlert = z.infer<typeof insertPriceAlertSchema>;
export type PriceAlert = typeof priceAlerts.$inferSelect;

export type InsertPriceHistory = z.infer<typeof insertPriceHistorySchema>;
export type PriceHistory = typeof priceHistory.$inferSelect;

export type FlightSearch = z.infer<typeof flightSearchSchema>;
