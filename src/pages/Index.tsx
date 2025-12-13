import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategoryNav from "@/components/CategoryNav";
import RestaurantGrid from "@/components/RestaurantGrid";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <CategoryNav />
        <RestaurantGrid />
      </main>
      
      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg gradient-hero flex items-center justify-center">
                <span className="text-primary-foreground text-sm font-bold">Q</span>
              </div>
              <span className="font-bold text-foreground">QuickBite</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 QuickBite. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
