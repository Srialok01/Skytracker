import React from "react";
import SearchForm from "./search-form";
import Airplane2 from "@/assets/airplane-2";

interface HeroSectionProps {
  onSearch: (origin: string, destination: string, minPrice: number, maxPrice: number) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  return (
    <section className="relative bg-primary py-16 md:py-24 overflow-hidden">
      <div className="absolute inset-0 z-0 opacity-30">
        <Airplane2 className="w-full h-full object-cover" />
      </div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl text-white mb-8">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">
            Track Flight Prices, Find the Best Deals
          </h1>
          <p className="text-lg opacity-90">
            Monitor fare prices in real-time and receive alerts when prices drop for your desired destinations.
          </p>
        </div>

        <SearchForm onSearch={onSearch} />
      </div>
    </section>
  );
};

export default HeroSection;
