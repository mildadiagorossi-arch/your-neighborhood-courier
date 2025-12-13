import { MapPin, ShoppingBag, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuickBite</span>
          </div>

          {/* Location - Desktop */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Paris, 75001</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Button variant="outline" size="icon" className="relative">
              <ShoppingBag className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-hero text-primary-foreground text-xs font-bold flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Profile */}
            <Button variant="ghost" size="icon" className="hidden md:flex">
              <User className="h-5 w-5" />
            </Button>

            {/* Login */}
            <Button variant="default" className="hidden md:flex">
              Connexion
            </Button>

            {/* Mobile Menu */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-border animate-fade-in">
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-secondary">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Paris, 75001</span>
              </div>
              <Button variant="default" className="w-full">
                Connexion
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
