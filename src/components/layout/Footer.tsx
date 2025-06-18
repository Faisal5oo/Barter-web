
import { ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-muted py-10 border-t">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-xl">
              <ShoppingBag className="h-6 w-6 text-secondary" />
              <span>CirculaX</span>
            </Link>
            <p className="mt-4 text-muted-foreground text-sm">
              A modern marketplace for bartering goods and services. Trade what you have for what you need.
            </p>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Marketplace</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/browse" className="text-muted-foreground hover:text-foreground transition-colors">
                  Browse All
                </Link>
              </li>
              <li>
                <Link to="/categories/electronics" className="text-muted-foreground hover:text-foreground transition-colors">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/categories/furniture" className="text-muted-foreground hover:text-foreground transition-colors">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/categories/vehicles" className="text-muted-foreground hover:text-foreground transition-colors">
                  Vehicles
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Account</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/account" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Account
                </Link>
              </li>
              <li>
                <Link to="/listings" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Listings
                </Link>
              </li>
              <li>
                <Link to="/offers" className="text-muted-foreground hover:text-foreground transition-colors">
                  My Offers
                </Link>
              </li>
              <li>
                <Link to="/messages" className="text-muted-foreground hover:text-foreground transition-colors">
                  Messages
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-sm mb-3">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/safety" className="text-muted-foreground hover:text-foreground transition-colors">
                  Safety Tips
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                  Terms & Policies
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-10 pt-6 border-t text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} CirculaX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
