import React, { useState } from "react";
import { Flight } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { ArrowDown, ArrowUp } from "lucide-react";

interface ResultsTableProps {
  flights: Flight[];
  onTrackPrice: (flight: Flight) => void;
  onBookFlight: (flight: Flight) => void;
}

const ResultsTable: React.FC<ResultsTableProps> = ({
  flights,
  onTrackPrice,
  onBookFlight,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Adjust as needed

  // Calculate pagination
  const totalPages = Math.ceil(flights.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentFlights = flights.slice(startIndex, endIndex);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-5 border-b border-neutral-200">
        <h3 className="font-heading font-semibold text-lg">Available Flights</h3>
        <p className="text-sm text-neutral-300">{flights.length} results found</p>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-neutral-100 text-neutral-400">
            <TableRow>
              <TableHead className="py-3 px-4 font-medium">Airline</TableHead>
              <TableHead className="py-3 px-4 font-medium">Departure</TableHead>
              <TableHead className="py-3 px-4 font-medium">Arrival</TableHead>
              <TableHead className="py-3 px-4 font-medium">Duration</TableHead>
              <TableHead className="py-3 px-4 font-medium">Price</TableHead>
              <TableHead className="py-3 px-4 font-medium">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentFlights.map((flight) => (
              <TableRow 
                key={flight.id} 
                className="border-b border-neutral-200 hover:bg-neutral-50 transition-colors"
              >
                <TableCell className="py-4 px-4">
                  <div className="flex items-center">
                    {/* Use the first letter of airline as a placeholder */}
                    <div className="w-8 h-8 mr-3 rounded bg-primary text-white flex items-center justify-center font-bold">
                      {flight.airline[0]}
                    </div>
                    <span>{flight.airline}</span>
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="font-medium">{flight.departureTime}</div>
                  <div className="text-sm text-neutral-300">{flight.origin}</div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="font-medium">{flight.arrivalTime}</div>
                  <div className="text-sm text-neutral-300">{flight.destination}</div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div>{flight.duration}</div>
                  <div className="text-sm text-neutral-300">
                    {flight.stops === 0 ? "Non-stop" : `${flight.stops} stop${flight.stops > 1 ? "s" : ""}`}
                  </div>
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="font-medium text-primary">${flight.price}</div>
                  {flight.priceChange && (
                    <div className={`text-xs ${flight.priceChange < 0 ? "text-success" : "text-error"}`}>
                      {flight.priceChange < 0 ? (
                        <span className="flex items-center">
                          <ArrowDown className="w-3 h-3 mr-1" />
                          ${Math.abs(flight.priceChange)} (last week)
                        </span>
                      ) : (
                        <span className="flex items-center">
                          <ArrowUp className="w-3 h-3 mr-1" />
                          ${flight.priceChange} (last week)
                        </span>
                      )}
                    </div>
                  )}
                </TableCell>
                <TableCell className="py-4 px-4">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => onTrackPrice(flight)}
                      className="bg-primary hover:bg-primary/90 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
                    >
                      Track
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onBookFlight(flight)}
                      className="bg-secondary hover:bg-secondary/90 text-white text-sm font-medium py-1 px-3 rounded transition-colors"
                    >
                      Book
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {totalPages > 1 && (
        <div className="p-5 border-t border-neutral-200 flex justify-between items-center">
          <div className="text-sm text-neutral-300">
            Showing <span className="font-medium">{startIndex + 1}-{Math.min(endIndex, flights.length)}</span> of{" "}
            <span className="font-medium">{flights.length}</span> results
          </div>
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
