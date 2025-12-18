import { MapPin, ShoppingBag, User, Menu, LogOut, Package, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { itemCount, setIsOpen } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border/50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl gradient-hero flex items-center justify-center">
              <ShoppingBag className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">QuickBite</span>
          </Link>

          {/* Location - Desktop */}
          <div className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-secondary text-secondary-foreground cursor-pointer hover:bg-secondary/80 transition-colors">
            <MapPin className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Paris, 75001</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Cart */}
            <Button 
              variant="outline" 
              size="icon" 
              className="relative"
              onClick={() => setIsOpen(true)}
            >
              <ShoppingBag className="h-5 w-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full gradient-hero text-primary-foreground text-xs font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </Button>

            {/* Auth */}
            {isAuthenticated ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled className="font-medium">
                    {user?.firstName} {user?.lastName}
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/orders">
                      <Package className="w-4 h-4 mr-2" />
                      Mes commandes
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/pos">
                      <LayoutDashboard className="w-4 h-4 mr-2" />
                      Interface POS
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="default" className="hidden md:flex" asChild>
                <Link to="/login">Connexion</Link>
              </Button>
            )}

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
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-sm font-medium">
                    {user?.firstName} {user?.lastName}
                  </div>
                  <Button variant="outline" onClick={logout} className="w-full">
                    <LogOut className="w-4 h-4 mr-2" />
                    Déconnexion
                  </Button>
                </>
              ) : (
                <Button variant="default" className="w-full" asChild>
                  <Link to="/login">Connexion</Link>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
