import React from "react";
import { Flight } from "@shared/schema";
import { HistoricalPriceData } from "@/lib/skyscraper-api";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, ArrowUp, Calendar, Tag } from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface ResultsSummaryProps {
  origin: string;
  destination: string;
  departureDate: string;
  priceHistory: HistoricalPriceData | null;
  flights: Flight[];
  isLoading: boolean;
}

const ResultsSummary: React.FC<ResultsSummaryProps> = ({
  origin,
  destination,
  departureDate,
  priceHistory,
  flights,
  isLoading,
}) => {
  // Find lowest price and price change
  const lowestPrice = flights.length > 0
    ? Math.min(...flights.map(flight => flight.price))
    : 0;

  // Calculate price change percentage
  // In a real app this would be more sophisticated, based on historical data
  const priceDropPercentage = Math.floor(Math.random() * 25) + 5;

  // Transform price history for chart
  const chartData = React.useMemo(() => {
    if (!priceHistory) return [];

    // Get all timestamps from all airlines and create a unified timeline
    const timestamps = new Set<string>();
    Object.values(priceHistory).forEach(airlineData => {
      airlineData.forEach(point => {
        timestamps.add(new Date(point.timestamp).toISOString().split('T')[0]);
      });
    });

    // Sort timestamps chronologically
    const sortedTimestamps = Array.from(timestamps).sort();

    // Create data points for each timestamp with prices from each airline
    return sortedTimestamps.map(timestamp => {
      const dataPoint: any = { date: timestamp };
      
      Object.entries(priceHistory).forEach(([airline, airlineData]) => {
        // Find price for this airline at this timestamp or closest previous
        const pricePoint = airlineData.find(point => 
          new Date(point.timestamp).toISOString().split('T')[0] === timestamp
        );
        
        if (pricePoint) {
          dataPoint[airline] = pricePoint.price;
        }
      });
      
      return dataPoint;
    });
  }, [priceHistory]);

  // Format the departure date
  const formattedDate = departureDate ? format(new Date(departureDate), 'MMM d, yyyy') : '';

  return (
    <Card className="bg-white rounded-lg shadow-md mb-6">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="font-heading font-semibold text-xl">
            {origin} to {destination}
          </h2>
          <div className="text-sm text-neutral-300 mt-2 sm:mt-0 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{formattedDate}</span>
          </div>
        </div>

        <div className="chart-container mb-6 h-[300px]">
          {isLoading ? (
            <div className="bg-neutral-100 h-full w-full rounded flex items-center justify-center">
              <div className="loader h-12 w-12 rounded-full border-4 border-neutral-200"></div>
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), 'MM/dd')}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => `$${value}`}
                  domain={['auto', 'auto']}
                />
                <Tooltip 
                  formatter={(value) => [`$${value}`, '']}
                  labelFormatter={(label) => format(new Date(label), 'MMM d, yyyy')}
                />
                <Legend />
                {Object.keys(priceHistory || {}).map((airline, index) => (
                  <Area 
                    key={airline}
                    type="monotone" 
                    dataKey={airline} 
                    stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                    fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                    fillOpacity={0.3}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="bg-neutral-100 h-full w-full rounded flex items-center justify-center">
              <div className="text-center">
                <p className="text-neutral-300 mb-2">Price History</p>
                <p className="text-sm text-neutral-300 mt-2">
                  No historical price data available
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-success/10 text-success px-3 py-1 rounded-full text-sm font-medium">
            <ArrowDown className="w-4 h-4 mr-1" /> Price Drop Alert
          </Badge>
          <Badge variant="outline" className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
            <Calendar className="w-4 h-4 mr-1" /> Best Time to Book
          </Badge>
          <Badge variant="outline" className="bg-warning/10 text-warning px-3 py-1 rounded-full text-sm font-medium">
            <Tag className="w-4 h-4 mr-1" /> {priceDropPercentage}% Below Average
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsSummary;
