import { MapPin, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImage from "@/assets/hero-delivery.jpg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Livreur en scooter"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-background/95 via-background/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="container relative z-10 py-16">
        <div className="max-w-2xl space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
              Vos repas{" "}
              <span className="text-gradient">livrés</span>
              <br />
              en un clic
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Découvrez les meilleurs restaurants près de chez vous et faites-vous livrer en quelques minutes.
            </p>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col sm:flex-row gap-3 max-w-xl">
            <div className="relative flex-1">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Entrez votre adresse..."
                className="w-full h-14 pl-12 pr-4 rounded-xl bg-card border border-border shadow-soft text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
              />
            </div>
            <Button variant="hero" size="xl" className="shrink-0">
              <Search className="h-5 w-5" />
              Rechercher
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 pt-4">
            <div className="animate-fade-in" style={{ animationDelay: "0.2s" }}>
              <p className="text-3xl font-bold text-foreground">500+</p>
              <p className="text-sm text-muted-foreground">Restaurants</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.3s" }}>
              <p className="text-3xl font-bold text-foreground">15 min</p>
              <p className="text-sm text-muted-foreground">Livraison moyenne</p>
            </div>
            <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
              <p className="text-3xl font-bold text-foreground">50k+</p>
              <p className="text-sm text-muted-foreground">Clients satisfaits</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
