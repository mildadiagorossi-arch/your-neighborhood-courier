import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { MapPin, Navigation } from 'lucide-react';

const restaurants = [
  { id: '1', name: 'La Bella Italia', lng: 2.3522, lat: 48.8566, cuisine: 'Italien' },
  { id: '2', name: 'Sushi Master', lng: 2.3488, lat: 48.8534, cuisine: 'Japonais' },
  { id: '3', name: 'Burger House', lng: 2.3600, lat: 48.8600, cuisine: 'Américain' },
  { id: '4', name: 'Le Petit Bistro', lng: 2.3450, lat: 48.8620, cuisine: 'Français' },
  { id: '5', name: 'Tacos Locos', lng: 2.3580, lat: 48.8480, cuisine: 'Mexicain' },
];

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [token, setToken] = useState(() => localStorage.getItem('mapbox-token') || '');
  const [isMapReady, setIsMapReady] = useState(false);
  const [inputToken, setInputToken] = useState(token);

  const initializeMap = () => {
    if (!mapContainer.current || !token) return;

    try {
      mapboxgl.accessToken = token;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [2.3522, 48.8566],
        zoom: 13,
        pitch: 45,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      map.current.on('load', () => {
        setIsMapReady(true);
        
        restaurants.forEach(restaurant => {
          const el = document.createElement('div');
          el.className = 'marker';
          el.innerHTML = `
            <div class="bg-primary text-primary-foreground p-2 rounded-full shadow-lg cursor-pointer transform hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11v3a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1v-3"/><path d="M12 19H4a1 1 0 0 1-1-1v-2a1 1 0 0 1 1-1h16a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-3.83"/><path d="m3 11 7.77-6.04a2 2 0 0 1 2.46 0L21 11H3Z"/><path d="M12.97 19.77 7 15h12.5l-3.75 4.5a2 2 0 0 1-2.78.27Z"/></svg>
            </div>
          `;

          new mapboxgl.Marker(el)
            .setLngLat([restaurant.lng, restaurant.lat])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(`
                <div class="p-2">
                  <h3 class="font-bold text-foreground">${restaurant.name}</h3>
                  <p class="text-sm text-muted-foreground">${restaurant.cuisine}</p>
                  <a href="/restaurant/${restaurant.id}" class="text-primary text-sm font-medium hover:underline">Voir le menu →</a>
                </div>
              `)
            )
            .addTo(map.current!);
        });
      });
    } catch (error) {
      console.error('Erreur Mapbox:', error);
      setIsMapReady(false);
    }
  };

  useEffect(() => {
    if (token) {
      initializeMap();
    }
    return () => {
      map.current?.remove();
    };
  }, [token]);

  const handleSaveToken = () => {
    localStorage.setItem('mapbox-token', inputToken);
    setToken(inputToken);
  };

  if (!token) {
    return (
      <div className="bg-card rounded-2xl p-8 shadow-elegant">
        <div className="text-center max-w-md mx-auto">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <MapPin className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">Configuration Mapbox</h3>
          <p className="text-muted-foreground mb-4">
            Pour afficher la carte, vous devez entrer votre token Mapbox public.
            <a 
              href="https://account.mapbox.com/access-tokens/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Obtenir un token →
            </a>
          </p>
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="pk.eyJ1IjoiLi4u"
              value={inputToken}
              onChange={(e) => setInputToken(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSaveToken} disabled={!inputToken}>
              Activer
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-2xl overflow-hidden shadow-elegant">
      <div ref={mapContainer} className="h-[400px] w-full" />
      <div className="absolute bottom-4 left-4 bg-card/90 backdrop-blur-sm rounded-lg px-4 py-2 shadow-lg">
        <div className="flex items-center gap-2 text-sm">
          <Navigation className="w-4 h-4 text-primary" />
          <span className="font-medium">{restaurants.length} restaurants à proximité</span>
        </div>
      </div>
    </div>
  );
};

export default Map;
