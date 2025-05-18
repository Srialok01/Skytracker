import { 
  User, InsertUser, 
  Flight, InsertFlight, 
  PriceAlert, InsertPriceAlert, 
  PriceHistory, InsertPriceHistory 
} from "@shared/schema";

// Storage interface
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Flight methods
  searchFlights(origin: string, destination: string, departureDate: string): Promise<Flight[]>;
  getFlightById(id: number): Promise<Flight | undefined>;
  createFlight(flight: InsertFlight): Promise<Flight>;
  updateFlightPrice(id: number, price: number, priceChange?: number): Promise<Flight>;

  // Price alert methods
  createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert>;
  getPriceAlerts(): Promise<PriceAlert[]>;
  getPriceAlertsByEmail(email: string): Promise<PriceAlert[]>;
  deactivatePriceAlert(id: number): Promise<void>;

  // Price history methods
  addPriceHistory(priceHistory: InsertPriceHistory): Promise<PriceHistory>;
  getPriceHistory(origin: string, destination: string, departureDate: string): Promise<PriceHistory[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private flights: Map<number, Flight>;
  private priceAlerts: Map<number, PriceAlert>;
  private priceHistories: PriceHistory[];
  private userIdCounter: number;
  private flightIdCounter: number;
  private priceAlertIdCounter: number;
  private priceHistoryIdCounter: number;

  constructor() {
    this.users = new Map();
    this.flights = new Map();
    this.priceAlerts = new Map();
    this.priceHistories = [];
    this.userIdCounter = 1;
    this.flightIdCounter = 1;
    this.priceAlertIdCounter = 1;
    this.priceHistoryIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Flight methods
  async searchFlights(origin: string, destination: string, departureDate: string): Promise<Flight[]> {
    return Array.from(this.flights.values()).filter(
      (flight) => 
        flight.origin === origin && 
        flight.destination === destination && 
        flight.departureDate.toString() === departureDate
    );
  }

  async getFlightById(id: number): Promise<Flight | undefined> {
    return this.flights.get(id);
  }

  async createFlight(flight: InsertFlight): Promise<Flight> {
    const id = this.flightIdCounter++;
    const newFlight: Flight = { ...flight, id };
    this.flights.set(id, newFlight);
    return newFlight;
  }

  async updateFlightPrice(id: number, price: number, priceChange?: number): Promise<Flight> {
    const flight = this.flights.get(id);
    if (!flight) {
      throw new Error(`Flight with id ${id} not found`);
    }

    const updatedFlight: Flight = {
      ...flight,
      price,
      priceChange: priceChange !== undefined ? priceChange : flight.priceChange,
      lastChecked: new Date(),
    };

    this.flights.set(id, updatedFlight);
    return updatedFlight;
  }

  // Price alert methods
  async createPriceAlert(alert: InsertPriceAlert): Promise<PriceAlert> {
    const id = this.priceAlertIdCounter++;
    const now = new Date();
    const priceAlert: PriceAlert = { ...alert, id, createdAt: now, active: true };
    this.priceAlerts.set(id, priceAlert);
    return priceAlert;
  }

  async getPriceAlerts(): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values()).filter(alert => alert.active);
  }

  async getPriceAlertsByEmail(email: string): Promise<PriceAlert[]> {
    return Array.from(this.priceAlerts.values()).filter(
      (alert) => alert.email === email && alert.active
    );
  }

  async deactivatePriceAlert(id: number): Promise<void> {
    const alert = this.priceAlerts.get(id);
    if (alert) {
      alert.active = false;
      this.priceAlerts.set(id, alert);
    }
  }

  // Price history methods
  async addPriceHistory(priceHistoryData: InsertPriceHistory): Promise<PriceHistory> {
    const id = this.priceHistoryIdCounter++;
    const priceHistory: PriceHistory = { ...priceHistoryData, id };
    this.priceHistories.push(priceHistory);
    return priceHistory;
  }

  async getPriceHistory(origin: string, destination: string, departureDate: string): Promise<PriceHistory[]> {
    return this.priceHistories.filter(
      (history) => 
        history.origin === origin && 
        history.destination === destination && 
        history.departureDate.toString() === departureDate
    );
  }
}

export const storage = new MemStorage();
