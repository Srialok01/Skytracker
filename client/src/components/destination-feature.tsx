import React from "react";
import { Link } from "wouter";
import Destination1 from "@/assets/destination-1";
import Destination2 from "@/assets/destination-2";
import Destination3 from "@/assets/destination-3";
import Destination4 from "@/assets/destination-4";

const destinations = [
  {
    id: 1,
    name: "Los Angeles",
    image: Destination3,
    price: 199,
  },
  {
    id: 2,
    name: "New York",
    image: Destination2,
    price: 249,
  },
  {
    id: 3,
    name: "Miami",
    image: Destination1,
    price: 179,
  },
  {
    id: 4,
    name: "San Francisco",
    image: Destination4,
    price: 159,
  },
];

const DestinationFeature: React.FC = () => {
  return (
    <section className="bg-white py-12">
      <div className="container mx-auto px-4">
        <h2 className="font-heading font-semibold text-2xl mb-8 text-center">Popular Destinations</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {destinations.map((destination) => (
            <div
              key={destination.id}
              className="relative rounded-lg overflow-hidden group shadow-md hover:shadow-lg transition-shadow"
            >
              <destination.image className="w-full h-48 object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex flex-col justify-end p-4">
                <h3 className="font-heading font-medium text-white text-xl">{destination.name}</h3>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-white text-sm">
                    Flights from <span className="font-medium">${destination.price}</span>
                  </span>
                  <Link href={`/?origin=NYC&destination=${destination.name.substring(0, 3).toUpperCase()}`}>
                    <a className="text-white text-sm underline hover:no-underline">View Deals</a>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DestinationFeature;
