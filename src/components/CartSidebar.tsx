import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from './ui/sheet';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { useCart } from '@/contexts/CartContext';
import { useOrders } from '@/contexts/OrderContext';
import { useAuth } from '@/contexts/AuthContext';
import { Minus, Plus, Trash2, ShoppingBag, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const CartSidebar = () => {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, total, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const [isCheckout, setIsCheckout] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState<string | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.firstName ? `${user.firstName} ${user.lastName}` : '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-primary" />
            Votre panier
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
              <ShoppingBag className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Votre panier est vide</h3>
            <p className="text-muted-foreground text-sm">
              Ajoutez des plats depuis les restaurants pour commencer votre commande
            </p>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-auto py-4 space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex gap-3 p-3 bg-muted/50 rounded-xl">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm truncate">{item.name}</h4>
                    <p className="text-xs text-muted-foreground mb-1">{item.restaurantName}</p>
                    {item.options && item.options.length > 0 && (
                      <p className="text-xs text-muted-foreground">
                        {item.options.join(', ')}
                      </p>
                    )}
                    <p className="font-semibold text-primary mt-1">
                      {(item.price * item.quantity).toFixed(2)} €
                    </p>
                  </div>
                  <div className="flex flex-col items-end justify-between">
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    <div className="flex items-center gap-2 bg-background rounded-lg p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 flex items-center justify-center rounded hover:bg-muted transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Sous-total</span>
                  <span>{total.toFixed(2)} €</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Livraison</span>
                  <span>2.99 €</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t">
                  <span>Total</span>
                  <span className="text-primary">{(total + 2.99).toFixed(2)} €</span>
                </div>
              </div>

              {!isCheckout ? (
                <>
                  <Button className="w-full" size="lg" onClick={() => setIsCheckout(true)}>
                    Commander • {(total + 2.99).toFixed(2)} €
                  </Button>
                  
                  <button 
                    onClick={clearCart}
                    className="w-full text-sm text-muted-foreground hover:text-destructive transition-colors"
                  >
                    Vider le panier
                  </button>
                </>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Votre nom"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse de livraison</Label>
                    <Input
                      id="address"
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, address: e.target.value }))}
                      placeholder="123 Rue Example, 75001 Paris"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="06 12 34 56 78"
                    />
                  </div>
                  <Button 
                    className="w-full" 
                    size="lg"
                    disabled={!customerInfo.name || !customerInfo.address || !customerInfo.phone}
                    onClick={() => {
                      const order = createOrder(items, customerInfo);
                      setOrderPlaced(order.id);
                      clearCart();
                      toast.success('Commande passée avec succès !', {
                        description: `Numéro de commande: ${order.id}`
                      });
                    }}
                  >
                    Confirmer la commande • {(total + 2.99).toFixed(2)} €
                  </Button>
                  <button 
                    onClick={() => setIsCheckout(false)}
                    className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Retour au panier
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Order Confirmation */}
        {orderPlaced && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h3 className="font-semibold text-lg mb-2">Commande confirmée !</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Numéro: {orderPlaced}
            </p>
            <Button 
              variant="outline"
              onClick={() => {
                setOrderPlaced(null);
                setIsCheckout(false);
                setIsOpen(false);
                window.location.href = `/orders/${orderPlaced}`;
              }}
            >
              Suivre ma commande
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSidebar;
