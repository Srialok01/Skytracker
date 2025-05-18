import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { PriceAlert } from "@shared/schema";
import { getPriceAlerts, deletePriceAlert } from "@/lib/skyscraper-api";
import { useToast } from "@/hooks/use-toast";
import { queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Bell, Trash2, Loader2, Mail, PlaneTakeoff, PlaneLanding, Calendar, AlertTriangle } from "lucide-react";

const emailSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const PriceAlerts: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const { toast } = useToast();

  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: {
      email: "",
    },
  });

  // Query for price alerts
  const {
    data: alertsData,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: [`/api/price-alerts?email=${email}`],
    enabled: !!email,
  });

  // Mutation for deleting price alerts
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deletePriceAlert(id),
    onSuccess: () => {
      toast({
        title: "Alert deleted",
        description: "Your price alert has been successfully deleted.",
      });
      // Invalidate the price alerts query to refresh the data
      queryClient.invalidateQueries({ queryKey: [`/api/price-alerts?email=${email}`] });
    },
    onError: () => {
      toast({
        title: "Failed to delete alert",
        description: "There was an error deleting your price alert. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: EmailFormValues) => {
    setEmail(data.email);
  };

  const handleDeleteAlert = (id: number) => {
    deleteMutation.mutate(id);
  };

  const alerts = alertsData?.alerts || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-3">Manage Your Price Alerts</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Enter your email address to view and manage the price alerts you've created.
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5 text-primary" />
              View Your Alerts
            </CardTitle>
            <CardDescription>
              Enter the email address you used to create your price alerts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-3">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <div className="relative">
                        <Mail className="absolute left-3 top-3 h-5 w-5 text-neutral-300" />
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="your@email.com"
                            className="w-full pl-10"
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="bg-primary text-white">
                  View Alerts
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {email && (
          <>
            {isLoading ? (
              <div className="text-center py-10">
                <Loader2 className="h-10 w-10 animate-spin mx-auto text-primary" />
                <p className="mt-4 text-neutral-400">Loading your price alerts...</p>
              </div>
            ) : isError ? (
              <Card className="bg-error/10 border-error/20">
                <CardContent className="pt-6 text-center">
                  <AlertTriangle className="h-10 w-10 text-error mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Failed to load price alerts</h3>
                  <p className="mb-4">There was an error loading your price alerts. Please try again later.</p>
                  <Button onClick={() => refetch()} variant="outline" className="bg-white">
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            ) : alerts.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center">
                  <Bell className="h-10 w-10 text-neutral-300 mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No price alerts found</h3>
                  <p>
                    You don't have any active price alerts for this email address. Create a price alert
                    by searching for a flight and clicking "Track" on the results page.
                  </p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>{alerts.length} Active Price Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Route</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Target Price</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead>Action</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {alerts.map((alert: PriceAlert) => (
                          <TableRow key={alert.id}>
                            <TableCell>
                              <div className="flex items-center">
                                <div className="flex items-center">
                                  <PlaneTakeoff className="h-4 w-4 mr-2 text-neutral-300" />
                                  {alert.origin}
                                </div>
                                <div className="mx-2">→</div>
                                <div className="flex items-center">
                                  <PlaneLanding className="h-4 w-4 mr-2 text-neutral-300" />
                                  {alert.destination}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-2 text-neutral-300" />
                                {format(new Date(alert.departureDate), 'MMM d, yyyy')}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className="font-medium text-primary">${alert.targetPrice}</span>
                            </TableCell>
                            <TableCell>
                              {format(new Date(alert.createdAt), 'MMM d, yyyy')}
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteAlert(alert.id)}
                                disabled={deleteMutation.isPending}
                                className="text-error hover:text-error hover:bg-error/10"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span className="sr-only">Delete</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
                <CardFooter className="border-t px-6 py-4">
                  <p className="text-sm text-neutral-300">
                    You'll receive an email notification when prices drop below your target price.
                  </p>
                </CardFooter>
              </Card>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default PriceAlerts;
