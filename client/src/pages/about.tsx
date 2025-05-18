import React from "react";
import { Link } from "wouter";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Plane, Bell, BarChart3, Search, ShieldCheck, Clock, Users, MailQuestion } from "lucide-react";
import Airplane3 from "@/assets/airplane-3";
import Airplane4 from "@/assets/airplane-4";

const About: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12 text-center">
          <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4">About SkyWatch</h1>
          <p className="text-lg text-neutral-300 max-w-2xl mx-auto">
            Your trusted companion for tracking flight prices and finding the best deals
            for your travel needs.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div>
            <h2 className="font-heading font-semibold text-2xl mb-4">Our Mission</h2>
            <p className="mb-4">
              At SkyWatch, we're on a mission to simplify the way travelers find and book flights. 
              We believe that everyone deserves access to fair flight prices and transparent information.
            </p>
            <p className="mb-4">
              Our platform leverages advanced technology to track flight prices in real-time, providing
              you with historical data, price predictions, and instant alerts when prices drop for your desired routes.
            </p>
            <p>
              We're committed to saving you time and money while making the flight booking process as 
              smooth and stress-free as possible.
            </p>
          </div>
          <div className="flex items-center justify-center">
            <Airplane3 className="w-full max-w-sm" />
          </div>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">How SkyWatch Works</CardTitle>
            <CardDescription>The technology behind our flight price tracking system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Search</h3>
                <p className="text-neutral-300">
                  Enter your origin, destination, and dates to search for flights across multiple airlines.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Track</h3>
                <p className="text-neutral-300">
                  Our system continuously monitors price changes and collects historical pricing data.
                </p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Bell className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-medium text-lg mb-2">Alert</h3>
                <p className="text-neutral-300">
                  Set your target price and receive alerts when fares drop below your threshold.
                </p>
              </div>
            </div>

            <p className="text-center mb-6">
              SkyWatch uses the powerful Skyscraper API to access real-time flight data from hundreds of airlines
              and travel agencies, ensuring you always get the most accurate and up-to-date information.
            </p>

            <div className="flex justify-center">
              <Link href="/">
                <a>
                  <Button className="bg-primary text-white">
                    <Plane className="mr-2 h-4 w-4" /> Try It Now
                  </Button>
                </a>
              </Link>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="flex items-center justify-center">
            <Airplane4 className="w-full max-w-sm" />
          </div>
          <div>
            <h2 className="font-heading font-semibold text-2xl mb-4">Why Choose SkyWatch</h2>

            <div className="space-y-4">
              <div className="flex">
                <div className="mr-4 mt-1">
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Accurate Data</h3>
                  <p className="text-neutral-300">
                    Our platform sources data directly from airlines and trusted partners to ensure accuracy.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Real-Time Updates</h3>
                  <p className="text-neutral-300">
                    Flight prices are updated in real-time so you never miss a deal.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">User-Friendly Interface</h3>
                  <p className="text-neutral-300">
                    Easy-to-use tools for searching, comparing, and tracking flight prices.
                  </p>
                </div>
              </div>
              <div className="flex">
                <div className="mr-4 mt-1">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-lg">Historical Price Data</h3>
                  <p className="text-neutral-300">
                    View price trends to determine if now is the right time to book.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Card className="mb-12">
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1">
                <AccordionTrigger>How accurate are the flight prices shown?</AccordionTrigger>
                <AccordionContent>
                  Our flight prices are refreshed in real-time through the Skyscraper API, which sources data directly 
                  from airlines and trusted travel partners. While we strive for 100% accuracy, prices can change rapidly, 
                  especially for popular routes. We recommend confirming the final price before booking.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>How do price alerts work?</AccordionTrigger>
                <AccordionContent>
                  Price alerts allow you to set a target price for a specific route and date. Once you create an alert, 
                  our system monitors prices continuously. When the price drops below your target, we'll send you an 
                  email notification so you can book at your desired price point.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3">
                <AccordionTrigger>Can I book flights directly through SkyWatch?</AccordionTrigger>
                <AccordionContent>
                  Currently, SkyWatch is focused on providing the best flight price tracking and comparison tools. 
                  When you find a flight you want to book, we redirect you to the airline's official website or a 
                  trusted partner to complete your booking securely.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-4">
                <AccordionTrigger>How far in advance can I track flight prices?</AccordionTrigger>
                <AccordionContent>
                  You can track flight prices for any date that airlines have made available for booking, which is 
                  typically up to 11-12 months in advance. For the best results, we recommend starting to track 
                  prices 3-6 months before your travel date.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-5">
                <AccordionTrigger>Is SkyWatch available for international flights?</AccordionTrigger>
                <AccordionContent>
                  Yes! SkyWatch supports both domestic and international routes across hundreds of airlines worldwide. 
                  Whether you're flying locally or globally, our platform can help you find the best deals.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Contact Us</CardTitle>
            <CardDescription>Have questions or feedback? We'd love to hear from you!</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col md:flex-row md:items-center justify-between">
            <div className="mb-6 md:mb-0">
              <p className="mb-4">
                Our team is always ready to assist you with any questions or concerns you might have about using SkyWatch.
              </p>
              <div className="flex items-center mt-4">
                <MailQuestion className="h-5 w-5 text-primary mr-2" />
                <a href="mailto:support@skywatch.example.com" className="text-primary hover:underline">
                  support@skywatch.example.com
                </a>
              </div>
            </div>
            <Link href="/">
              <a>
                <Button className="bg-primary text-white">
                  Start Tracking Prices
                </Button>
              </a>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
