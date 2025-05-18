import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Flight } from "@shared/schema";
import { searchFlights } from "@/lib/skyscraper-api";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calendar, Loader2, PlaneLanding, PlaneTakeoff, Wifi, Clock, Coffee, Utensils, ChevronRight } from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

// Schema for flight search form
const compareFormSchema = z.object({
  origin: z.string()
    .min(3, "Enter a valid airport code (3 letters)")
    .max(3, "Enter a valid airport code (3 letters)")
    .toUpperCase(),
  destination: z.string()
    .min(3, "Enter a valid airport code (3 letters)")
    .max(3, "Enter a valid airport code (3 letters)")
    .toUpperCase(),
  departureDate: z.string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
    .refine((date) => new Date(date) >= new Date(new Date().setHours(0, 0, 0, 0)), {
      message: "Date cannot be in the past",
    }),
});

type CompareFormValues = z.infer<typeof compareFormSchema>;

// Feature ratings for airlines (simulated data)
const airlineFeatures = {
  "American Airlines": { legroom: 3.5, wifi: 4, entertainment: 4, food: 3, service: 4, punctuality: 3.5 },
  "Delta Air Lines": { legroom: 4, wifi: 4.5, entertainment: 4.5, food: 4, service: 4.5, punctuality: 4 },
  "United Airlines": { legroom: 3, wifi: 3.5, entertainment: 3.5, food: 3, service: 3.5, punctuality: 3.5 },
  "Southwest Airlines": { legroom: 3.5, wifi: 3, entertainment: 2.5, food: 2.5, service: 4, punctuality: 4.5 },
};

const Compare: React.FC = () => {
  const [searchParams, setSearchParams] = useState({
    origin: "",
    destination: "",
    date: "",
  });
  
  const { toast } = useToast();

  const form = useForm<CompareFormValues>({
    resolver: zodResolver(compareFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      departureDate: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
    },
  });

  // Fetch flights for comparison
  const {
    data: flightsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [
      `/api/flights?origin=${searchParams.origin}&destination=${searchParams.destination}&date=${searchParams.date}`,
    ],
    enabled: !!searchParams.origin && !!searchParams.destination && !!searchParams.date,
  });

  const flights = flightsData?.flights || [];

  // Group flights by airline for comparison
  const flightsByAirline = React.useMemo(() => {
    const grouped: Record<string, Flight[]> = {};
    
    flights.forEach(flight => {
      if (!grouped[flight.airline]) {
        grouped[flight.airline] = [];
      }
      grouped[flight.airline].push(flight);
    });
    
    return grouped;
  }, [flights]);

  // Get airlines for comparison
  const airlines = Object.keys(flightsByAirline);

  // Calculate average prices by airline
  const priceComparisonData = React.useMemo(() => {
    return airlines.map(airline => {
      const flights = flightsByAirline[airline];
      const averagePrice = flights.reduce((sum, flight) => sum + flight.price, 0) / flights.length;
      
      return {
        name: airline,
        price: Math.round(averagePrice),
      };
    });
  }, [airlines, flightsByAirline]);

  // Format feature data for radar chart
  const featureComparisonData = React.useMemo(() => {
    const features = ["legroom", "wifi", "entertainment", "food", "service", "punctuality"];
    
    return features.map(feature => {
      const data: Record<string, any> = { feature };
      
      airlines.forEach(airline => {
        if (airlineFeatures[airline as keyof typeof airlineFeatures]) {
          data[airline] = airlineFeatures[airline as keyof typeof airlineFeatures][feature as keyof typeof airlineFeatures["American Airlines"]];
        } else {
          // Default values if airline not found
          data[airline] = 3;
        }
      });
      
      return data;
    });
  }, [airlines]);

  const onSubmit = (data: CompareFormValues) => {
    setSearchParams({
      origin: data.origin,
      destination: data.destination,
      date: data.departureDate,
    });
  };

  // Find cheapest flight by airline
  const getCheapestFlightByAirline = (airline: string) => {
    if (!flightsByAirline[airline] || flightsByAirline[airline].length === 0) return null;
    
    return flightsByAirline[airline].reduce((prev, current) => 
      prev.price < current.price ? prev : current
    );
  };

  // Check if search has been performed
  const hasSearched = !!searchParams.origin && !!searchParams.destination && !!searchParams.date;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Compare Airlines</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Search for a route to compare prices, features, and services across different airlines.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Search Flights to Compare</CardTitle>
            <CardDescription>
              Enter your route and date to see a detailed comparison between airlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="origin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>From</FormLabel>
                      <div className="relative">
                        <PlaneTakeoff className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Airport code (e.g. JFK)"
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="destination"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>To</FormLabel>
                      <div className="relative">
                        <PlaneLanding className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Airport code (e.g. LAX)"
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="departureDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Date</FormLabel>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                        <FormControl>
                          <Input
                            {...field}
                            type="date"
                            className="pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-3 mt-2">
                  <Button type="submit" className="w-full bg-primary text-white">
                    Compare Airlines
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        {isLoading && (
          <div className="text-center py-10">
            <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-neutral-400">Loading flight comparison data...</p>
          </div>
        )}

        {isError && (
          <Card className="bg-error/10 border-error/20">
            <CardContent className="pt-6 text-center">
              <Loader2 className="h-10 w-10 text-error mx-auto mb-4" />
              <h3 className="text-xl font-medium mb-2">Failed to load comparison data</h3>
              <p className="mb-4">There was an error loading flight data. Please try again later.</p>
              <Button onClick={() => refetch()} variant="outline" className="bg-white">
                Try Again
              </Button>
            </CardContent>
          </Card>
        )}

        {hasSearched && !isLoading && !isError && airlines.length === 0 && (
          <Card>
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-medium mb-2">No flights found</h3>
              <p>
                We couldn't find any flights for the selected route and date. Please try different search criteria.
              </p>
            </CardContent>
          </Card>
        )}

        {hasSearched && !isLoading && !isError && airlines.length > 0 && (
          <Tabs defaultValue="price" className="mt-8">
            <TabsList className="w-full flex mb-6">
              <TabsTrigger value="price" className="flex-1">Price Comparison</TabsTrigger>
              <TabsTrigger value="features" className="flex-1">Features & Amenities</TabsTrigger>
              <TabsTrigger value="details" className="flex-1">Flight Details</TabsTrigger>
            </TabsList>
            
            <TabsContent value="price" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Price Comparison</CardTitle>
                  <CardDescription>
                    Average prices for {searchParams.origin} to {searchParams.destination} on {format(new Date(searchParams.date), 'MMMM d, yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[400px] mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={priceComparisonData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis tickFormatter={(value) => `₹${value}`} />
                        <Tooltip formatter={(value) => [`₹${value}`, 'Average Price']} />
                        <Legend />
                        <Bar dataKey="price" fill="hsl(var(--primary))" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="overflow-x-auto mt-6">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Airline</TableHead>
                          <TableHead>Lowest Price</TableHead>
                          <TableHead>Average Price</TableHead>
                          <TableHead>Options</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {priceComparisonData.map(item => {
                          const cheapestFlight = getCheapestFlightByAirline(item.name);
                          return (
                            <TableRow key={item.name}>
                              <TableCell className="font-medium">{item.name}</TableCell>
                              <TableCell className="text-primary font-medium">
                                ${cheapestFlight?.price}
                              </TableCell>
                              <TableCell>${item.price}</TableCell>
                              <TableCell>
                                {flightsByAirline[item.name].length} flights available
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="features" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Features & Amenities Comparison</CardTitle>
                  <CardDescription>
                    Comparing the quality of services and amenities across airlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-[500px] mb-8">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart outerRadius={150} data={featureComparisonData}>
                        <PolarGrid />
                        <PolarAngleAxis dataKey="feature" />
                        <PolarRadiusAxis angle={30} domain={[0, 5]} />
                        {airlines.map((airline, index) => (
                          <Radar
                            key={airline}
                            name={airline}
                            dataKey={airline}
                            stroke={`hsl(var(--chart-${(index % 5) + 1}))`}
                            fill={`hsl(var(--chart-${(index % 5) + 1}))`}
                            fillOpacity={0.3}
                          />
                        ))}
                        <Legend />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {airlines.map(airline => (
                      <Card key={airline} className="overflow-hidden">
                        <CardHeader className="bg-neutral-50 pb-3">
                          <CardTitle className="text-lg">{airline}</CardTitle>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Coffee className="h-4 w-4 mr-2 text-neutral-400" />
                                <span>Food & Beverages</span>
                              </div>
                              <div className="text-sm font-medium">
                                {airlineFeatures[airline as keyof typeof airlineFeatures]?.food || 3}/5
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Wifi className="h-4 w-4 mr-2 text-neutral-400" />
                                <span>Wi-Fi Quality</span>
                              </div>
                              <div className="text-sm font-medium">
                                {airlineFeatures[airline as keyof typeof airlineFeatures]?.wifi || 3}/5
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="flex items-center">
                                <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                                <span>Punctuality</span>
                              </div>
                              <div className="text-sm font-medium">
                                {airlineFeatures[airline as keyof typeof airlineFeatures]?.punctuality || 3}/5
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="details" className="mt-0">
              <Card>
                <CardHeader>
                  <CardTitle>Flight Details</CardTitle>
                  <CardDescription>
                    Comparing flight options and details across airlines
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {Object.entries(flightsByAirline).map(([airline, airlineFlights]) => (
                      <Card key={airline} className="overflow-hidden">
                        <CardHeader className="bg-neutral-50 pb-3">
                          <CardTitle className="text-lg">{airline}</CardTitle>
                          <CardDescription>
                            {airlineFlights.length} flight options available
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4">
                          <div className="overflow-x-auto">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead>Departure</TableHead>
                                  <TableHead>Arrival</TableHead>
                                  <TableHead>Duration</TableHead>
                                  <TableHead>Stops</TableHead>
                                  <TableHead>Price</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {airlineFlights.slice(0, 3).map(flight => (
                                  <TableRow key={flight.id}>
                                    <TableCell>
                                      <div className="font-medium">{flight.departureTime}</div>
                                      <div className="text-sm text-neutral-300">{flight.origin}</div>
                                    </TableCell>
                                    <TableCell>
                                      <div className="font-medium">{flight.arrivalTime}</div>
                                      <div className="text-sm text-neutral-300">{flight.destination}</div>
                                    </TableCell>
                                    <TableCell>{flight.duration}</TableCell>
                                    <TableCell>
                                      {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                                    </TableCell>
                                    <TableCell className="font-medium text-primary">
                                      ${flight.price}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                          
                          {airlineFlights.length > 3 && (
                            <div className="mt-4 text-right">
                              <Button variant="link" className="text-primary">
                                View all {airlineFlights.length} flights <ChevronRight className="ml-1 h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
};

export default Compare;
