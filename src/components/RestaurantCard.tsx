import { Star, Clock, Bike } from "lucide-react";

interface RestaurantCardProps {
  name: string;
  image: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  featured?: boolean;
}

const RestaurantCard = ({
  name,
  image,
  cuisine,
  rating,
  deliveryTime,
  deliveryFee,
  featured = false,
}: RestaurantCardProps) => {
  return (
    <article
      className={`group relative bg-card rounded-2xl overflow-hidden shadow-soft hover:shadow-card-hover transition-all duration-500 cursor-pointer hover:scale-[1.02] ${
        featured ? "ring-2 ring-primary/30" : ""
      }`}
    >
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/40 to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="px-3 py-1 rounded-full text-xs font-semibold gradient-hero text-primary-foreground">
              Populaire
            </span>
          )}
        </div>

        {/* Delivery Fee Badge */}
        <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-card/90 backdrop-blur-sm text-xs font-semibold text-foreground flex items-center gap-1.5">
          <Bike className="h-3.5 w-3.5" />
          {deliveryFee}
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors">
              {name}
            </h3>
            <p className="text-sm text-muted-foreground">{cuisine}</p>
          </div>
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary">
            <Star className="h-4 w-4 fill-current" />
            <span className="font-bold text-sm">{rating}</span>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            <span>{deliveryTime}</span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default RestaurantCard;
