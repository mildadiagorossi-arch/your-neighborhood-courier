import RestaurantCard from "./RestaurantCard";

const restaurants = [
  {
    name: "La Pizza Napoli",
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&h=600&fit=crop",
    cuisine: "Italien • Pizza",
    rating: 4.8,
    deliveryTime: "20-30 min",
    deliveryFee: "2,50 €",
    featured: true,
  },
  {
    name: "Burger House",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop",
    cuisine: "Américain • Burgers",
    rating: 4.6,
    deliveryTime: "15-25 min",
    deliveryFee: "1,99 €",
    featured: true,
  },
  {
    name: "Sushi Master",
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800&h=600&fit=crop",
    cuisine: "Japonais • Sushi",
    rating: 4.9,
    deliveryTime: "25-35 min",
    deliveryFee: "3,00 €",
    featured: false,
  },
  {
    name: "Green Bowl",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&h=600&fit=crop",
    cuisine: "Healthy • Salades",
    rating: 4.7,
    deliveryTime: "15-20 min",
    deliveryFee: "2,00 €",
    featured: false,
  },
  {
    name: "Le Bistrot Français",
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop",
    cuisine: "Français • Traditionnel",
    rating: 4.5,
    deliveryTime: "30-40 min",
    deliveryFee: "3,50 €",
    featured: false,
  },
  {
    name: "Taco Loco",
    image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&h=600&fit=crop",
    cuisine: "Mexicain • Tacos",
    rating: 4.4,
    deliveryTime: "20-30 min",
    deliveryFee: "2,50 €",
    featured: true,
  },
];

const RestaurantGrid = () => {
  return (
    <section className="py-12">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-foreground">
              Restaurants près de vous
            </h2>
            <p className="text-muted-foreground mt-1">
              Découvrez les meilleurs restaurants de votre quartier
            </p>
          </div>
          <button className="text-primary font-semibold hover:underline underline-offset-4 transition-all">
            Voir tout →
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {restaurants.map((restaurant, index) => (
            <div
              key={restaurant.name}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <RestaurantCard {...restaurant} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RestaurantGrid;
