import React, { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { Flight } from "@shared/schema";
import { useLocation } from "wouter";
import { searchFlights, getPriceHistory, createPriceAlert, HistoricalPriceData } from "@/lib/skyscraper-api";
import HeroSection from "@/components/hero-section";
import FiltersPanel from "@/components/filters-panel";
import ResultsSummary from "@/components/results-summary";
import ResultsTable from "@/components/results-table";
import DestinationFeature from "@/components/destination-feature";
import PriceAlertSection from "@/components/price-alert-section";
import PriceAlertModal from "@/components/price-alert-modal";
import { queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

const Home: React.FC = () => {
  // Get search params from URL
  const [location, setLocation] = useLocation();
  const urlParams = new URLSearchParams(location.split("?")[1] || "");
  
  // State for search parameters
  const [searchParams, setSearchParams] = useState({
    origin: urlParams.get("origin") || "",
    destination: urlParams.get("destination") || "",
    minPrice: parseInt(urlParams.get("minPrice") || "1000"),
    maxPrice: parseInt(urlParams.get("maxPrice") || "10000"),
  });

  // State for price alert modal
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const [isAlertSubmitting, setIsAlertSubmitting] = useState(false);

  // State for filters
  const [maxPrice, setMaxPrice] = useState(2000);
  const [filteredAirlines, setFilteredAirlines] = useState<string[]>([]);
  const [filteredStops, setFilteredStops] = useState<number[]>([0, 1]);
  const [priceLimit, setPriceLimit] = useState(2000);

  // Get toast
  const { toast } = useToast();

  // Fetch flights
  const {
    data: flightsData,
    isLoading: isFlightsLoading,
    isError: isFlightsError,
    refetch: refetchFlights,
  } = useQuery({
    queryKey: [
      `/api/flights?origin=${searchParams.origin}&destination=${searchParams.destination}&minPrice=${searchParams.minPrice}&maxPrice=${searchParams.maxPrice}`,
    ],
    enabled: !!searchParams.origin && !!searchParams.destination && !!searchParams.minPrice && !!searchParams.maxPrice,
  });

  // Fetch price history
  const {
    data: priceHistoryData,
    isLoading: isPriceHistoryLoading,
    isError: isPriceHistoryError,
  } = useQuery({
    queryKey: [
      `/api/price-history?origin=${searchParams.origin}&destination=${searchParams.destination}`,
    ],
    enabled: !!searchParams.origin && !!searchParams.destination && !isFlightsLoading && !!flightsData?.flights,
  });

  // Extract flights and price history
  const flights = flightsData ? (Array.isArray(flightsData) ? flightsData : flightsData.flights || []) : [];
  const priceHistory: HistoricalPriceData | null = priceHistoryData ? priceHistoryData.priceHistory || null : null;

  // Update airlines filter when flights change
  useEffect(() => {
    if (flights && flights.length > 0) {
      const airlines = [...new Set(flights.map((flight) => flight.airline))];
      setFilteredAirlines(airlines);
      
      // Find maximum price for slider
      const maxFlightPrice = Math.max(...flights.map((flight) => flight.price));
      setMaxPrice(Math.ceil(maxFlightPrice / 100) * 100); // Round up to nearest hundred
      setPriceLimit(Math.ceil(maxFlightPrice / 100) * 100);
    }
  }, [flights]);

  // Handle search
  const handleSearch = (origin: string, destination: string, minPrice: number, maxPrice: number) => {
    // Update URL with search parameters
    setLocation(`/?origin=${origin}&destination=${destination}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
    
    // Update search params state
    setSearchParams({ origin, destination, minPrice, maxPrice });
    
    // Refetch data
    refetchFlights();
  };

  // Apply filters to flights
  const filteredFlights = flights.filter((flight) => {
    return (
      filteredAirlines.includes(flight.airline) &&
      filteredStops.includes(flight.stops) &&
      flight.price <= priceLimit
    );
  });

  // Handle price change filter
  const handlePriceChange = (price: number) => {
    setPriceLimit(price);
  };

  // Handle airline filter change
  const handleAirlineChange = (airline: string, checked: boolean) => {
    if (checked) {
      setFilteredAirlines((prev) => [...prev, airline]);
    } else {
      setFilteredAirlines((prev) => prev.filter((a) => a !== airline));
    }
  };

  // Handle stops filter change
  const handleStopsChange = (stops: number, checked: boolean) => {
    if (checked) {
      setFilteredStops((prev) => [...prev, stops]);
    } else {
      setFilteredStops((prev) => prev.filter((s) => s !== stops));
    }
  };

  // Reset all filters
  const handleResetFilters = () => {
    if (flights && flights.length > 0) {
      const airlines = [...new Set(flights.map((flight) => flight.airline))];
      setFilteredAirlines(airlines);
      setFilteredStops([0, 1]);
      setPriceLimit(maxPrice);
    }
  };

  // Handle track price button click
  const handleTrackPrice = (flight: Flight) => {
    setSelectedFlight(flight);
    setIsAlertModalOpen(true);
  };

  // Handle book flight button click - redirect to external booking page
  const handleBookFlight = (flight: Flight) => {
    // In a real app, this would redirect to a booking page or partner site
    toast({
      title: "Redirecting to booking page",
      description: `You'll be redirected to book your flight from ${flight.origin} to ${flight.destination} with ${flight.airline} for $${flight.price}.`,
    });
  };

  // Handle create alert button click from price alert section
  const handleCreateAlert = () => {
    // If there are flights, select the cheapest one for the alert
    if (filteredFlights.length > 0) {
      const cheapestFlight = filteredFlights.reduce((prev, current) => 
        prev.price < current.price ? prev : current
      );
      setSelectedFlight(cheapestFlight);
      setIsAlertModalOpen(true);
    } else {
      setIsAlertModalOpen(true); // Open modal without a selected flight
    }
  };

  // Handle create alert form submission
  const handleCreatePriceAlert = async (email: string, targetPrice: number) => {
    if (!selectedFlight) return;
    
    try {
      setIsAlertSubmitting(true);
      
      await createPriceAlert({
        origin: selectedFlight.origin,
        destination: selectedFlight.destination,
        departureDate: selectedFlight.departureDate.toString(),
        targetPrice,
        email,
      });
      
      toast({
        title: "Price alert created",
        description: `We'll notify you at ${email} when the price drops below $${targetPrice}.`,
      });
      
      setIsAlertModalOpen(false);
    } catch (error) {
      toast({
        title: "Failed to create price alert",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsAlertSubmitting(false);
    }
  };

  // Show loading state
  const isLoading = isFlightsLoading || isPriceHistoryLoading;
  const hasError = isFlightsError || isPriceHistoryError;
  const hasResults = !isLoading && !hasError && flights.length > 0;
  const hasSearched = !!searchParams.origin && !!searchParams.destination;

  return (
    <main className="flex-1">
      <HeroSection onSearch={handleSearch} />

      <div className="container mx-auto px-4 py-12">
        {/* Loading State */}
        {isLoading && (
          <div className="py-12 text-center">
            <div className="loader mx-auto h-12 w-12 rounded-full border-4 border-neutral-200 border-t-primary animate-spin"></div>
            <p className="mt-4 text-lg text-neutral-400">Searching for the best flight prices...</p>
          </div>
        )}

        {/* Error State */}
        {hasError && (
          <div className="py-12 text-center">
            <div className="bg-error/10 text-error rounded-lg p-6 inline-block">
              <div className="text-3xl mb-2 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
              <h3 className="text-xl font-medium mb-2">Unable to fetch flight prices</h3>
              <p>Please check your connection and try again later.</p>
              <button 
                className="mt-4 bg-error hover:bg-error/90 text-white font-medium py-2 px-4 rounded-md transition-colors"
                onClick={() => refetchFlights()}
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* No search yet state */}
        {!hasSearched && !isLoading && (
          <div className="py-12 text-center">
            <p className="text-lg text-neutral-400">
              Enter your flight details above to search for prices.
            </p>
          </div>
        )}

        {/* Results Section */}
        {hasSearched && hasResults && (
          <div className="flex flex-col md:flex-row gap-6 mb-8">
            {/* Filters Panel */}
            <FiltersPanel
              airlines={[...new Set(flights.map((flight) => flight.airline))]}
              maxPrice={maxPrice}
              onPriceChange={handlePriceChange}
              onAirlineChange={handleAirlineChange}
              onStopsChange={handleStopsChange}
              onReset={handleResetFilters}
            />

            <div className="flex-1">
              {/* Results Summary with price history chart */}
              <ResultsSummary
                origin={searchParams.origin}
                destination={searchParams.destination}
                departureDate={flights.length > 0 ? flights[0].departureDate : new Date().toISOString().split('T')[0]}
                priceHistory={priceHistory}
                flights={filteredFlights}
                isLoading={isPriceHistoryLoading}
              />

              {/* Results Table */}
              <ResultsTable
                flights={filteredFlights}
                onTrackPrice={handleTrackPrice}
                onBookFlight={handleBookFlight}
              />
            </div>
          </div>
        )}

        {/* No results state */}
        {hasSearched && !isLoading && !hasError && flights.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-lg text-neutral-400">
              No flights found for the selected route and date. Please try different search criteria.
            </p>
          </div>
        )}
      </div>

      {/* Price Alert Section */}
      <PriceAlertSection onCreateAlert={handleCreateAlert} />

      {/* Price Alert Modal */}
      <PriceAlertModal
        isOpen={isAlertModalOpen}
        onClose={() => setIsAlertModalOpen(false)}
        flight={selectedFlight}
        onCreateAlert={handleCreatePriceAlert}
        isSubmitting={isAlertSubmitting}
      />
    </main>
  );
};

export default Home;
