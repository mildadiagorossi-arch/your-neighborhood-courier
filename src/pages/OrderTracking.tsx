import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders, OrderStatus } from '@/contexts/OrderContext';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck, CheckCircle, ChefHat, AlertCircle, ArrowLeft, FileText } from 'lucide-react';

const statusConfig: Record<OrderStatus, { label: string; color: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: 'bg-yellow-500', icon: <Clock className="w-5 h-5" /> },
  preparing: { label: 'En préparation', color: 'bg-blue-500', icon: <ChefHat className="w-5 h-5" /> },
  ready: { label: 'Prête', color: 'bg-purple-500', icon: <Package className="w-5 h-5" /> },
  delivering: { label: 'En livraison', color: 'bg-orange-500', icon: <Truck className="w-5 h-5" /> },
  delivered: { label: 'Livrée', color: 'bg-green-500', icon: <CheckCircle className="w-5 h-5" /> },
  cancelled: { label: 'Annulée', color: 'bg-red-500', icon: <AlertCircle className="w-5 h-5" /> }
};

const statusSteps: OrderStatus[] = ['pending', 'preparing', 'ready', 'delivering', 'delivered'];

const OrderTracking = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById, orders } = useOrders();
  
  const order = orderId ? getOrderById(orderId) : null;

  if (!orderId) {
    // Show all orders
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <h1 className="text-3xl font-bold mb-8">Mes commandes</h1>
          
          {orders.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <Package className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-semibold mb-2">Aucune commande</h3>
                <p className="text-muted-foreground mb-4">Vous n'avez pas encore passé de commande</p>
                <Link to="/">
                  <Button>Découvrir les restaurants</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {orders.map(order => (
                <Link key={order.id} to={`/orders/${order.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-semibold">{order.restaurantName}</p>
                          <p className="text-sm text-muted-foreground">
                            {order.id} • {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                          <p className="text-sm">{order.items.length} article(s) • {order.total.toFixed(2)} €</p>
                        </div>
                        <Badge className={`${statusConfig[order.status].color} text-white`}>
                          {statusConfig[order.status].label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <AlertCircle className="w-16 h-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">Commande introuvable</h3>
              <Link to="/orders">
                <Button variant="outline">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Retour aux commandes
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const currentStepIndex = statusSteps.indexOf(order.status);

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <Link to="/orders" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Retour aux commandes
        </Link>

        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Commande {order.id}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
              <Badge className={`${statusConfig[order.status].color} text-white text-sm px-3 py-1`}>
                {statusConfig[order.status].icon}
                <span className="ml-2">{statusConfig[order.status].label}</span>
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            {/* Progress Steps */}
            {order.status !== 'cancelled' && (
              <div className="mb-8">
                <div className="flex items-center justify-between relative">
                  <div className="absolute left-0 right-0 top-5 h-1 bg-muted">
                    <div 
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                    />
                  </div>
                  {statusSteps.map((step, index) => (
                    <div key={step} className="relative z-10 flex flex-col items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        index <= currentStepIndex ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                      }`}>
                        {statusConfig[step].icon}
                      </div>
                      <span className="text-xs mt-2 text-center">{statusConfig[step].label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estimated Delivery */}
            {order.estimatedDelivery && order.status !== 'delivered' && order.status !== 'cancelled' && (
              <div className="bg-primary/10 rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Livraison estimée</p>
                <p className="text-lg font-semibold">
                  {new Date(order.estimatedDelivery).toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
              </div>
            )}

            {/* Order Items */}
            <div className="space-y-3 mb-6">
              <h3 className="font-semibold">Articles commandés</h3>
              {order.items.map(item => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div className="flex-1">
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">Quantité: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">{(item.price * item.quantity).toFixed(2)} €</p>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{(order.total - order.deliveryFee).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Livraison</span>
                <span>{order.deliveryFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>Total</span>
                <span className="text-primary">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice Link */}
        <Link to={`/invoice/${order.id}`}>
          <Button variant="outline" className="w-full">
            <FileText className="w-4 h-4 mr-2" />
            Voir la facture
          </Button>
        </Link>
      </main>
    </div>
  );
};

export default OrderTracking;
