import React, { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Flight } from "@shared/schema";

interface FiltersPanelProps {
  airlines: string[];
  maxPrice: number;
  onPriceChange: (price: number) => void;
  onAirlineChange: (airline: string, checked: boolean) => void;
  onStopsChange: (stops: number, checked: boolean) => void;
  onReset: () => void;
}

const FiltersPanel: React.FC<FiltersPanelProps> = ({
  airlines,
  maxPrice,
  onPriceChange,
  onAirlineChange,
  onStopsChange,
  onReset,
}) => {
  const [priceRange, setPriceRange] = useState<number>(maxPrice);

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value[0]);
    onPriceChange(value[0]);
  };

  return (
    <div className="w-full md:w-64 bg-white rounded-lg shadow-md p-5 h-fit">
      <h3 className="font-heading font-semibold text-lg mb-4">Filters</h3>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Price Range</h4>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>$0</span>
            <span>${maxPrice}</span>
          </div>
          <Slider
            defaultValue={[priceRange]}
            max={maxPrice}
            step={10}
            onValueChange={handlePriceChange}
            className="w-full h-2"
          />
          <div className="text-center text-sm">
            Max price: <span className="font-medium">${priceRange}</span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Airlines</h4>
        <div className="space-y-2">
          {airlines.map((airline) => (
            <div key={airline} className="flex items-center space-x-2">
              <Checkbox
                id={`airline-${airline.replace(/\s+/g, '-').toLowerCase()}`}
                defaultChecked
                onCheckedChange={(checked) => onAirlineChange(airline, !!checked)}
              />
              <Label
                htmlFor={`airline-${airline.replace(/\s+/g, '-').toLowerCase()}`}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                {airline}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h4 className="font-medium mb-3">Stops</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="non-stop"
              defaultChecked
              onCheckedChange={(checked) => onStopsChange(0, !!checked)}
            />
            <Label
              htmlFor="non-stop"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Non-stop
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="one-stop"
              defaultChecked
              onCheckedChange={(checked) => onStopsChange(1, !!checked)}
            />
            <Label
              htmlFor="one-stop"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              1 Stop
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="two-plus-stops"
              onCheckedChange={(checked) => onStopsChange(2, !!checked)}
            />
            <Label
              htmlFor="two-plus-stops"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              2+ Stops
            </Label>
          </div>
        </div>
      </div>

      <Button
        onClick={onReset}
        variant="outline"
        className="w-full bg-neutral-200 hover:bg-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded-md transition-colors"
      >
        Reset Filters
      </Button>
    </div>
  );
};

export default FiltersPanel;
