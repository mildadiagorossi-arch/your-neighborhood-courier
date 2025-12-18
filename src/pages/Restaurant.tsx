import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { ArrowLeft, Star, Clock, MapPin, Plus, Check } from 'lucide-react';
import Header from '@/components/Header';

const restaurantsData: Record<string, {
  id: string;
  name: string;
  cuisine: string;
  rating: number;
  deliveryTime: string;
  deliveryFee: string;
  image: string;
  address: string;
  description: string;
  menu: {
    category: string;
    items: {
      id: string;
      name: string;
      description: string;
      price: number;
      image: string;
      options?: { name: string; price: number }[];
    }[];
  }[];
}> = {
  '1': {
    id: '1',
    name: 'La Bella Italia',
    cuisine: 'Italien',
    rating: 4.8,
    deliveryTime: '25-35 min',
    deliveryFee: '2.99 €',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800',
    address: '15 rue de la Paix, Paris',
    description: 'Authentique cuisine italienne avec des produits frais importés directement d\'Italie.',
    menu: [
      {
        category: 'Pizzas',
        items: [
          { id: '1-1', name: 'Margherita', description: 'Tomate, mozzarella, basilic frais', price: 12.90, image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400', options: [{ name: 'Extra fromage', price: 2 }, { name: 'Pâte fine', price: 0 }] },
          { id: '1-2', name: 'Quattro Formaggi', description: 'Mozzarella, gorgonzola, parmesan, chèvre', price: 15.90, image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400', options: [{ name: 'Extra fromage', price: 2 }] },
          { id: '1-3', name: 'Diavola', description: 'Tomate, mozzarella, pepperoni épicé', price: 14.90, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400' },
        ]
      },
      {
        category: 'Pâtes',
        items: [
          { id: '1-4', name: 'Carbonara', description: 'Guanciale, œuf, parmesan, poivre noir', price: 13.90, image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400' },
          { id: '1-5', name: 'Bolognaise', description: 'Sauce tomate, viande hachée, herbes', price: 12.90, image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400' },
        ]
      },
      {
        category: 'Desserts',
        items: [
          { id: '1-6', name: 'Tiramisu', description: 'Mascarpone, café, cacao', price: 7.90, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400' },
          { id: '1-7', name: 'Panna Cotta', description: 'Crème vanille, coulis fruits rouges', price: 6.90, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400' },
        ]
      }
    ]
  },
  '2': {
    id: '2',
    name: 'Sushi Master',
    cuisine: 'Japonais',
    rating: 4.9,
    deliveryTime: '30-40 min',
    deliveryFee: '3.49 €',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=800',
    address: '42 avenue des Champs-Élysées, Paris',
    description: 'Les meilleurs sushis de Paris, préparés par un chef japonais expérimenté.',
    menu: [
      {
        category: 'Sushis & Makis',
        items: [
          { id: '2-1', name: 'Assortiment 18 pièces', description: 'Saumon, thon, crevette, avocat', price: 24.90, image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?w=400' },
          { id: '2-2', name: 'California Roll', description: '8 pièces, crabe, avocat, concombre', price: 12.90, image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400' },
        ]
      },
      {
        category: 'Plats chauds',
        items: [
          { id: '2-3', name: 'Ramen Tonkotsu', description: 'Bouillon porc, œuf, porc chashu, algues', price: 15.90, image: 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400' },
        ]
      }
    ]
  }
};

const Restaurant = () => {
  const { id } = useParams<{ id: string }>();
  const { addItem } = useCart();
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string[]>>({});
  const [addedItems, setAddedItems] = useState<Set<string>>(new Set());

  const restaurant = id ? restaurantsData[id] : null;

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-2xl font-bold mb-4">Restaurant non trouvé</h1>
          <Link to="/" className="text-primary hover:underline">Retour à l'accueil</Link>
        </div>
      </div>
    );
  }

  const toggleOption = (itemId: string, optionName: string) => {
    setSelectedOptions(prev => {
      const current = prev[itemId] || [];
      if (current.includes(optionName)) {
        return { ...prev, [itemId]: current.filter(o => o !== optionName) };
      }
      return { ...prev, [itemId]: [...current, optionName] };
    });
  };

  const handleAddToCart = (item: typeof restaurant.menu[0]['items'][0]) => {
    const options = selectedOptions[item.id] || [];
    const optionPrices = item.options?.filter(o => options.includes(o.name)).reduce((sum, o) => sum + o.price, 0) || 0;
    
    addItem({
      id: `${item.id}-${options.join('-')}`,
      name: item.name,
      price: item.price + optionPrices,
      image: item.image,
      restaurantId: restaurant.id,
      restaurantName: restaurant.name,
      options: options.length > 0 ? options : undefined,
    });

    setAddedItems(prev => new Set(prev).add(item.id));
    setTimeout(() => {
      setAddedItems(prev => {
        const next = new Set(prev);
        next.delete(item.id);
        return next;
      });
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero */}
      <div className="relative h-64 md:h-80">
        <img 
          src={restaurant.image} 
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <Link 
          to="/" 
          className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm p-2 rounded-full hover:bg-background transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      <div className="container mx-auto px-4 -mt-20 relative z-10 pb-12">
        {/* Info */}
        <div className="bg-card rounded-2xl p-6 shadow-elegant mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{restaurant.name}</h1>
          <p className="text-muted-foreground mb-4">{restaurant.description}</p>
          
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-medium">{restaurant.rating}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{restaurant.deliveryTime}</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{restaurant.address}</span>
            </div>
            <span className="text-primary font-medium">Livraison {restaurant.deliveryFee}</span>
          </div>
        </div>

        {/* Menu */}
        <div className="space-y-8">
          {restaurant.menu.map(category => (
            <div key={category.category}>
              <h2 className="text-xl font-bold mb-4">{category.category}</h2>
              <div className="grid gap-4">
                {category.items.map(item => (
                  <div key={item.id} className="bg-card rounded-xl p-4 flex gap-4 shadow-sm hover:shadow-md transition-shadow">
                    <img 
                      src={item.image} 
                      alt={item.name}
                      className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold mb-1">{item.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{item.description}</p>
                      
                      {item.options && (
                        <div className="flex flex-wrap gap-2 mb-3">
                          {item.options.map(option => (
                            <button
                              key={option.name}
                              onClick={() => toggleOption(item.id, option.name)}
                              className={`text-xs px-2 py-1 rounded-full border transition-colors ${
                                (selectedOptions[item.id] || []).includes(option.name)
                                  ? 'bg-primary text-primary-foreground border-primary'
                                  : 'border-border hover:border-primary'
                              }`}
                            >
                              {option.name} {option.price > 0 && `+${option.price}€`}
                            </button>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary">{item.price.toFixed(2)} €</span>
                        <Button 
                          size="sm" 
                          onClick={() => handleAddToCart(item)}
                          className="gap-1"
                        >
                          {addedItems.has(item.id) ? (
                            <>
                              <Check className="w-4 h-4" />
                              Ajouté
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4" />
                              Ajouter
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Restaurant;
