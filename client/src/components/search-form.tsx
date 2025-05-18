import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { IndianRupee, Plane, PlaneLanding, PlaneTakeoff } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchFormProps {
  onSearch: (origin: string, destination: string, minPrice: number, maxPrice: number) => void;
}

// Define the new search schema with price range
const searchFormSchema = z.object({
  origin: z.string()
    .min(3, "Enter a valid airport code (3 letters)")
    .max(3, "Enter a valid airport code (3 letters)")
    .toUpperCase(),
  destination: z.string()
    .min(3, "Enter a valid airport code (3 letters)")
    .max(3, "Enter a valid airport code (3 letters)")
    .toUpperCase(),
  minPrice: z.coerce.number()
    .min(500, "Minimum price must be at least ₹500")
    .max(50000, "Minimum price cannot exceed ₹50,000"),
  maxPrice: z.coerce.number()
    .min(1000, "Maximum price must be at least ₹1,000")
    .max(100000, "Maximum price cannot exceed ₹100,000")
}).refine((data) => data.minPrice < data.maxPrice, {
  message: "Minimum price must be less than maximum price",
  path: ["minPrice"]
});

type SearchFormValues = z.infer<typeof searchFormSchema>;

const SearchForm: React.FC<SearchFormProps> = ({ onSearch }) => {
  const form = useForm<SearchFormValues>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      origin: "",
      destination: "",
      minPrice: 1000,
      maxPrice: 10000,
    },
  });

  const onSubmit = (data: SearchFormValues) => {
    onSearch(data.origin, data.destination, data.minPrice, data.maxPrice);
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-5 md:p-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          <FormField
            control={form.control}
            name="origin"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block font-medium text-neutral-400">From</FormLabel>
                <FormControl>
                  <div className="relative">
                    <PlaneTakeoff className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                    <Input
                      {...field}
                      placeholder="City or airport (e.g. DEL)"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      list="origin-list"
                    />
                    <datalist id="origin-list">
                      <option value="DEL">Delhi</option>
                      <option value="BOM">Mumbai</option>
                      <option value="BLR">Bangalore</option>
                      <option value="MAA">Chennai</option>
                      <option value="CCU">Kolkata</option>
                      <option value="HYD">Hyderabad</option>
                      <option value="GOI">Goa</option>
                      <option value="COK">Kochi</option>
                    </datalist>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="destination"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block font-medium text-neutral-400">To</FormLabel>
                <FormControl>
                  <div className="relative">
                    <PlaneLanding className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                    <Input
                      {...field}
                      placeholder="City or airport (e.g. BOM)"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      list="destination-list"
                    />
                    <datalist id="destination-list">
                      <option value="DEL">Delhi</option>
                      <option value="BOM">Mumbai</option>
                      <option value="BLR">Bangalore</option>
                      <option value="MAA">Chennai</option>
                      <option value="CCU">Kolkata</option>
                      <option value="HYD">Hyderabad</option>
                      <option value="GOI">Goa</option>
                      <option value="COK">Kochi</option>
                    </datalist>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block font-medium text-neutral-400">Min Price (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                    <Input
                      {...field}
                      type="number"
                      min={500}
                      placeholder="1000"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem className="space-y-2">
                <FormLabel className="block font-medium text-neutral-400">Max Price (₹)</FormLabel>
                <FormControl>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                    <Input
                      {...field}
                      type="number"
                      min={1000}
                      placeholder="10000"
                      className="w-full pl-10 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-end col-span-1 md:col-span-2 lg:col-span-4">
            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <Plane className="mr-2 h-4 w-4" />
              Search Flights
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default SearchForm;
