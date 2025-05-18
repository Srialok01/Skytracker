import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Flight } from "@shared/schema";
import { format } from "date-fns";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plane } from "lucide-react";

// Schema for price alert form
const priceAlertSchema = z.object({
  targetPrice: z.string()
    .refine(value => !isNaN(Number(value)) && Number(value) > 0, {
      message: "Please enter a valid price greater than 0",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type PriceAlertFormValues = z.infer<typeof priceAlertSchema>;

interface PriceAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  flight: Flight | null;
  onCreateAlert: (email: string, targetPrice: number) => void;
  isSubmitting: boolean;
}

const PriceAlertModal: React.FC<PriceAlertModalProps> = ({
  isOpen,
  onClose,
  flight,
  onCreateAlert,
  isSubmitting,
}) => {
  const form = useForm<PriceAlertFormValues>({
    resolver: zodResolver(priceAlertSchema),
    defaultValues: {
      targetPrice: flight ? String(Math.floor(flight.price * 0.9)) : "",
      email: "",
    },
  });

  React.useEffect(() => {
    if (flight) {
      form.setValue("targetPrice", String(Math.floor(flight.price * 0.9)));
    }
  }, [flight, form]);

  const onSubmit = (data: PriceAlertFormValues) => {
    onCreateAlert(data.email, Number(data.targetPrice));
  };

  const formattedDate = flight?.departureDate 
    ? format(new Date(flight.departureDate), 'MMM d, yyyy') 
    : '';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 m-4">
        <DialogHeader>
          <DialogTitle className="font-heading font-semibold text-xl mb-4">Set Price Alert</DialogTitle>
        </DialogHeader>

        {flight && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <p className="font-medium">
                {flight.origin} → {flight.destination}
              </p>
              <span className="text-sm text-neutral-300">{formattedDate}</span>
            </div>
            <div className="flex justify-between items-center px-4 py-3 bg-neutral-100 rounded">
              <div>
                <p className="text-sm text-neutral-300">Current lowest price</p>
                <p className="font-medium text-primary text-lg">${flight.price}</p>
              </div>
              <Plane className="text-neutral-300 text-xl" />
            </div>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="targetPrice"
              render={({ field }) => (
                <FormItem className="mb-4">
                  <FormLabel className="block font-medium mb-2">
                    Alert me when price drops below
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-neutral-300">$</span>
                      <Input
                        {...field}
                        type="number"
                        min="1"
                        className="w-full pl-8 pr-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="mb-6">
                  <FormLabel className="block font-medium mb-2">
                    Email address for alerts
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      placeholder="your@email.com"
                      className="w-full px-4 py-2 border border-neutral-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                {isSubmitting ? "Creating..." : "Create Alert"}
              </Button>
              <DialogClose asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-400 font-medium py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default PriceAlertModal;
