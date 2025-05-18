import React from "react";
import { Link } from "wouter";
import { 
  Plane, 
  Facebook, 
  Twitter, 
  Instagram, 
  Linkedin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer: React.FC = () => {
  return (
    <footer className="bg-neutral-400 text-white pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-10">
          <div>
            <h3 className="font-heading font-semibold text-xl mb-4 flex items-center">
              <Plane className="mr-2" />
              SkyWatch
            </h3>
            <p className="text-neutral-200 mb-4">
              Track flight prices in real-time and find the best deals for your travel needs.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-neutral-200 hover:text-white transition-colors">
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <a className="text-neutral-200 hover:text-white transition-colors">Home</a>
                </Link>
              </li>
              <li>
                <Link href="/price-alerts">
                  <a className="text-neutral-200 hover:text-white transition-colors">Price Alerts</a>
                </Link>
              </li>
              <li>
                <Link href="/compare">
                  <a className="text-neutral-200 hover:text-white transition-colors">Compare Flights</a>
                </Link>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Popular Routes</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Travel Guides</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Help Center</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">FAQ</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Contact Us</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Privacy Policy</a>
              </li>
              <li>
                <a href="#" className="text-neutral-200 hover:text-white transition-colors">Terms of Service</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-medium text-lg mb-4">Newsletter</h4>
            <p className="text-neutral-200 mb-4">
              Subscribe to our newsletter for the latest flight deals and travel tips.
            </p>
            <form className="flex">
              <Input
                type="email"
                placeholder="Your email address"
                className="flex-1 py-2 px-3 rounded-l-md text-neutral-400 focus:outline-none"
              />
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-white font-medium py-2 px-4 rounded-r-md transition-colors rounded-l-none">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        <div className="border-t border-neutral-300/30 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-200 text-sm mb-4 md:mb-0">
            © {new Date().getFullYear()} SkyWatch. All rights reserved.
          </p>
          <div className="flex space-x-4">
            <a href="#" className="text-neutral-200 hover:text-white text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-neutral-200 hover:text-white text-sm transition-colors">
              Terms of Service
            </a>
            <a href="#" className="text-neutral-200 hover:text-white text-sm transition-colors">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
