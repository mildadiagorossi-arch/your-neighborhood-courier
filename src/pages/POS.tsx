import React, { useState } from 'react';
import { useOrders, OrderStatus, Order } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, Package, Truck, CheckCircle, ChefHat, AlertCircle, 
  ArrowRight, FileText, Printer, RefreshCw, User, MapPin, Phone
} from 'lucide-react';
import { Link } from 'react-router-dom';

const statusConfig: Record<OrderStatus, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  pending: { label: 'En attente', color: 'text-yellow-700', bgColor: 'bg-yellow-100', icon: <Clock className="w-4 h-4" /> },
  preparing: { label: 'En préparation', color: 'text-blue-700', bgColor: 'bg-blue-100', icon: <ChefHat className="w-4 h-4" /> },
  ready: { label: 'Prête', color: 'text-purple-700', bgColor: 'bg-purple-100', icon: <Package className="w-4 h-4" /> },
  delivering: { label: 'En livraison', color: 'text-orange-700', bgColor: 'bg-orange-100', icon: <Truck className="w-4 h-4" /> },
  delivered: { label: 'Livrée', color: 'text-green-700', bgColor: 'bg-green-100', icon: <CheckCircle className="w-4 h-4" /> },
  cancelled: { label: 'Annulée', color: 'text-red-700', bgColor: 'bg-red-100', icon: <AlertCircle className="w-4 h-4" /> }
};

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  pending: 'preparing',
  preparing: 'ready',
  ready: 'delivering',
  delivering: 'delivered'
};

const POS = () => {
  const { orders, updateOrderStatus, getOrdersByStatus } = useOrders();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const pendingOrders = getOrdersByStatus('pending');
  const preparingOrders = getOrdersByStatus('preparing');
  const readyOrders = getOrdersByStatus('ready');
  const deliveringOrders = getOrdersByStatus('delivering');
  const completedOrders = [...getOrdersByStatus('delivered'), ...getOrdersByStatus('cancelled')];

  const handleAdvanceStatus = (order: Order) => {
    const next = nextStatus[order.status];
    if (next) {
      updateOrderStatus(order.id, next);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    updateOrderStatus(orderId, 'cancelled');
  };

  const OrderCard = ({ order, showActions = true }: { order: Order; showActions?: boolean }) => (
    <Card 
      className={`cursor-pointer transition-all hover:shadow-md ${selectedOrder?.id === order.id ? 'ring-2 ring-primary' : ''}`}
      onClick={() => setSelectedOrder(order)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="font-bold text-lg">{order.id}</p>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
          <Badge className={`${statusConfig[order.status].bgColor} ${statusConfig[order.status].color}`}>
            {statusConfig[order.status].icon}
            <span className="ml-1">{statusConfig[order.status].label}</span>
          </Badge>
        </div>
        
        <div className="space-y-1 mb-3">
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-muted-foreground" />
            <span>{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="w-4 h-4" />
            <span className="truncate">{order.customerAddress}</span>
          </div>
        </div>

        <div className="text-sm mb-3">
          <p className="font-medium">{order.items.length} article(s)</p>
          <ul className="text-muted-foreground">
            {order.items.slice(0, 2).map(item => (
              <li key={item.id}>• {item.quantity}x {item.name}</li>
            ))}
            {order.items.length > 2 && (
              <li>• +{order.items.length - 2} autres...</li>
            )}
          </ul>
        </div>

        <div className="flex items-center justify-between pt-3 border-t">
          <span className="font-bold text-primary">{order.total.toFixed(2)} €</span>
          {showActions && nextStatus[order.status] && (
            <Button 
              size="sm" 
              onClick={(e) => {
                e.stopPropagation();
                handleAdvanceStatus(order);
              }}
            >
              {statusConfig[nextStatus[order.status]!].label}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-primary">QuickBite POS</h1>
              <p className="text-sm text-muted-foreground">Gestion des commandes</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualiser
              </Button>
              <Link to="/">
                <Button variant="ghost" size="sm">Retour au site</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Orders List */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="active">
              <TabsList className="mb-4">
                <TabsTrigger value="active" className="relative">
                  Actives
                  {pendingOrders.length + preparingOrders.length + readyOrders.length + deliveringOrders.length > 0 && (
                    <Badge className="ml-2 bg-primary text-primary-foreground">
                      {pendingOrders.length + preparingOrders.length + readyOrders.length + deliveringOrders.length}
                    </Badge>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">Terminées</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-6">
                {/* Pending */}
                {pendingOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Clock className="w-5 h-5 text-yellow-600" />
                      En attente ({pendingOrders.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {pendingOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Preparing */}
                {preparingOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <ChefHat className="w-5 h-5 text-blue-600" />
                      En préparation ({preparingOrders.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {preparingOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Ready */}
                {readyOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="w-5 h-5 text-purple-600" />
                      Prêtes ({readyOrders.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {readyOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {/* Delivering */}
                {deliveringOrders.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="w-5 h-5 text-orange-600" />
                      En livraison ({deliveringOrders.length})
                    </h3>
                    <div className="grid gap-4 md:grid-cols-2">
                      {deliveringOrders.map(order => (
                        <OrderCard key={order.id} order={order} />
                      ))}
                    </div>
                  </div>
                )}

                {pendingOrders.length + preparingOrders.length + readyOrders.length + deliveringOrders.length === 0 && (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
                      <h3 className="text-xl font-semibold">Toutes les commandes sont traitées !</h3>
                      <p className="text-muted-foreground">Aucune commande active pour le moment</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="completed">
                {completedOrders.length > 0 ? (
                  <div className="grid gap-4 md:grid-cols-2">
                    {completedOrders.map(order => (
                      <OrderCard key={order.id} order={order} showActions={false} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <Package className="w-16 h-16 text-muted-foreground mb-4" />
                      <h3 className="text-xl font-semibold">Aucune commande terminée</h3>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>

          {/* Order Details Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Détails de la commande</CardTitle>
              </CardHeader>
              <CardContent>
                {selectedOrder ? (
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Numéro</p>
                      <p className="font-bold text-lg">{selectedOrder.id}</p>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground">Client</p>
                      <p className="font-medium">{selectedOrder.customerName}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="w-3 h-3" />
                        {selectedOrder.customerPhone}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-muted-foreground mt-1">
                        <MapPin className="w-3 h-3 mt-0.5" />
                        {selectedOrder.customerAddress}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-muted-foreground mb-2">Articles</p>
                      <div className="space-y-2">
                        {selectedOrder.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span>{item.quantity}x {item.name}</span>
                            <span>{(item.price * item.quantity).toFixed(2)} €</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex justify-between text-sm">
                        <span>Sous-total</span>
                        <span>{(selectedOrder.total - selectedOrder.deliveryFee).toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Livraison</span>
                        <span>{selectedOrder.deliveryFee.toFixed(2)} €</span>
                      </div>
                      <div className="flex justify-between font-bold text-lg mt-2">
                        <span>Total</span>
                        <span className="text-primary">{selectedOrder.total.toFixed(2)} €</span>
                      </div>
                    </div>

                    <div className="space-y-2 pt-4 border-t">
                      <Link to={`/invoice/${selectedOrder.id}`} className="block">
                        <Button variant="outline" className="w-full">
                          <FileText className="w-4 h-4 mr-2" />
                          Voir la facture
                        </Button>
                      </Link>
                      <Button variant="outline" className="w-full" onClick={() => window.print()}>
                        <Printer className="w-4 h-4 mr-2" />
                        Imprimer
                      </Button>
                      {selectedOrder.status !== 'cancelled' && selectedOrder.status !== 'delivered' && (
                        <Button 
                          variant="destructive" 
                          className="w-full"
                          onClick={() => handleCancelOrder(selectedOrder.id)}
                        >
                          <AlertCircle className="w-4 h-4 mr-2" />
                          Annuler la commande
                        </Button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                    <p>Sélectionnez une commande pour voir les détails</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default POS;
