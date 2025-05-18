import { apiRequest } from './queryClient';
import { Flight, PriceAlert, PriceHistory } from '@shared/schema';

interface FlightSearchParams {
  origin: string;
  destination: string;
  minPrice?: number;
  maxPrice?: number;
}

interface PriceHistoryParams {
  origin: string;
  destination: string;
}

interface PriceAlertParams {
  origin: string;
  destination: string;
  departureDate: string;
  targetPrice: number;
  email: string;
}

export interface HistoricalPriceData {
  [airline: string]: {
    price: number;
    timestamp: Date;
  }[];
}

// API functions for flights
export const searchFlights = async (params: FlightSearchParams): Promise<Flight[]> => {
  const queryParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
  });
  
  if (params.minPrice !== undefined) {
    queryParams.append('minPrice', params.minPrice.toString());
  }
  
  if (params.maxPrice !== undefined) {
    queryParams.append('maxPrice', params.maxPrice.toString());
  }

  const res = await apiRequest('GET', `/api/flights?${queryParams}`);
  const data = await res.json();
  return data.flights || [];
};

// API functions for price history
export const getPriceHistory = async (params: PriceHistoryParams): Promise<HistoricalPriceData> => {
  const queryParams = new URLSearchParams({
    origin: params.origin,
    destination: params.destination,
  });

  const res = await apiRequest('GET', `/api/price-history?${queryParams}`);
  const data = await res.json();
  return data.priceHistory || {};
};

// API functions for price alerts
export const createPriceAlert = async (params: PriceAlertParams): Promise<PriceAlert> => {
  const res = await apiRequest('POST', '/api/price-alerts', params);
  return await res.json();
};

export const getPriceAlerts = async (email: string): Promise<PriceAlert[]> => {
  const queryParams = new URLSearchParams({ email });
  const res = await apiRequest('GET', `/api/price-alerts?${queryParams}`);
  const data = await res.json();
  return data.alerts;
};

export const deletePriceAlert = async (id: number): Promise<void> => {
  await apiRequest('DELETE', `/api/price-alerts/${id}`);
};
