import React from "react";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import Airplane1 from "@/assets/airplane-1";

interface PriceAlertSectionProps {
  onCreateAlert: () => void;
}

const PriceAlertSection: React.FC<PriceAlertSectionProps> = ({ onCreateAlert }) => {
  return (
    <section className="bg-neutral-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-primary to-accent rounded-lg shadow-lg p-6 md:p-10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-white max-w-xl">
              <h2 className="font-heading font-bold text-2xl md:text-3xl mb-4">
                Never Miss a Price Drop
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Set up price alerts and we'll notify you when the fare drops for your desired routes. 
                Save up to 40% on your next flight!
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={onCreateAlert}
                  className="bg-white text-primary hover:bg-neutral-100 font-medium py-3 px-6 rounded-md transition-colors"
                >
                  <Bell className="mr-2 h-4 w-4" />
                  Create Alert
                </Button>
                <Button 
                  variant="outline" 
                  className="bg-transparent text-white border border-white hover:bg-white/10 font-medium py-3 px-6 rounded-md transition-colors"
                >
                  Learn More
                </Button>
              </div>
            </div>

            <div className="w-full md:w-auto">
              <Airplane1 className="w-full max-w-sm rounded-lg shadow-xl" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PriceAlertSection;
