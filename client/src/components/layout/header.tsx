import React from "react";
import { Link, useLocation } from "wouter";
import { Plane } from "lucide-react";

const Header: React.FC = () => {
  const [location] = useLocation();

  const isActiveLink = (path: string) => {
    return location === path ? "text-primary" : "hover:text-primary";
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center mb-4 md:mb-0">
          <Plane className="text-primary text-3xl mr-2" />
          <h1 className="font-heading font-bold text-2xl text-neutral-400">SkyWatch</h1>
        </div>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <a className={`font-medium transition-colors ${isActiveLink("/")}`}>Home</a>
              </Link>
            </li>
            <li>
              <Link href="/price-alerts">
                <a className={`font-medium transition-colors ${isActiveLink("/price-alerts")}`}>
                  Price Alerts
                </a>
              </Link>
            </li>
            <li>
              <Link href="/compare">
                <a className={`font-medium transition-colors ${isActiveLink("/compare")}`}>
                  Compare
                </a>
              </Link>
            </li>
            <li>
              <Link href="/about">
                <a className={`font-medium transition-colors ${isActiveLink("/about")}`}>
                  About
                </a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
