import { UtensilsCrossed, Coffee, Pizza, IceCream, Salad, Beef, Fish, Cake } from "lucide-react";

const categories = [
  { icon: UtensilsCrossed, name: "Tout", color: "bg-primary/10 text-primary" },
  { icon: Pizza, name: "Pizza", color: "bg-orange-100 text-orange-600" },
  { icon: Beef, name: "Burgers", color: "bg-red-100 text-red-600" },
  { icon: Salad, name: "Healthy", color: "bg-green-100 text-green-600" },
  { icon: Fish, name: "Sushi", color: "bg-blue-100 text-blue-600" },
  { icon: Coffee, name: "Café", color: "bg-amber-100 text-amber-700" },
  { icon: IceCream, name: "Desserts", color: "bg-pink-100 text-pink-600" },
  { icon: Cake, name: "Pâtisserie", color: "bg-purple-100 text-purple-600" },
];

const CategoryNav = () => {
  return (
    <section className="py-8">
      <div className="container">
        <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className={`flex items-center gap-3 px-6 py-4 rounded-2xl bg-card shadow-soft border border-border/50 hover:shadow-card hover:scale-[1.02] transition-all duration-300 whitespace-nowrap animate-fade-in ${
                index === 0 ? "ring-2 ring-primary" : ""
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`p-2 rounded-xl ${category.color}`}>
                <category.icon className="h-5 w-5" />
              </div>
              <span className="font-semibold text-foreground">{category.name}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryNav;
