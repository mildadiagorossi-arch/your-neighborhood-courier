import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useOrders } from '@/contexts/OrderContext';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Printer, Download } from 'lucide-react';

const Invoice = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrderById } = useOrders();
  
  const order = orderId ? getOrderById(orderId) : null;

  const handlePrint = () => {
    window.print();
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-4">Facture introuvable</h2>
          <Link to="/orders">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Retour aux commandes
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Actions Bar - Hidden when printing */}
      <div className="print:hidden bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to={`/orders/${order.id}`}>
              <Button variant="ghost">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Retour à la commande
              </Button>
            </Link>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handlePrint}>
                <Printer className="w-4 h-4 mr-2" />
                Imprimer
              </Button>
              <Button onClick={handlePrint}>
                <Download className="w-4 h-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="bg-background rounded-xl shadow-lg p-8 print:shadow-none print:p-0">
          {/* Header */}
          <div className="flex items-start justify-between mb-8 pb-8 border-b">
            <div>
              <h1 className="text-3xl font-bold text-primary mb-1">QuickBite</h1>
              <p className="text-muted-foreground">Service de livraison de repas</p>
            </div>
            <div className="text-right">
              <h2 className="text-2xl font-bold mb-1">FACTURE</h2>
              <p className="text-muted-foreground">{order.invoiceNumber}</p>
            </div>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">FACTURÉ À</h3>
              <p className="font-medium">{order.customerName}</p>
              <p className="text-sm text-muted-foreground">{order.customerAddress}</p>
              <p className="text-sm text-muted-foreground">{order.customerPhone}</p>
            </div>
            <div className="text-right">
              <h3 className="font-semibold text-sm text-muted-foreground mb-2">DÉTAILS</h3>
              <p className="text-sm">
                <span className="text-muted-foreground">Commande:</span> {order.id}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Date:</span>{' '}
                {new Date(order.createdAt).toLocaleDateString('fr-FR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
              <p className="text-sm">
                <span className="text-muted-foreground">Restaurant:</span> {order.restaurantName}
              </p>
            </div>
          </div>

          {/* Items Table */}
          <div className="mb-8">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-semibold">Article</th>
                  <th className="text-center py-3 font-semibold">Qté</th>
                  <th className="text-right py-3 font-semibold">Prix unit.</th>
                  <th className="text-right py-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map(item => (
                  <tr key={item.id} className="border-b">
                    <td className="py-4">
                      <p className="font-medium">{item.name}</p>
                      {item.options && item.options.length > 0 && (
                        <p className="text-sm text-muted-foreground">{item.options.join(', ')}</p>
                      )}
                    </td>
                    <td className="text-center py-4">{item.quantity}</td>
                    <td className="text-right py-4">{item.price.toFixed(2)} €</td>
                    <td className="text-right py-4 font-medium">{(item.price * item.quantity).toFixed(2)} €</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Sous-total</span>
                <span>{(order.total - order.deliveryFee).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Frais de livraison</span>
                <span>{order.deliveryFee.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">TVA (10%)</span>
                <span>{((order.total - order.deliveryFee) * 0.1).toFixed(2)} €</span>
              </div>
              <div className="flex justify-between pt-2 border-t text-lg font-bold">
                <span>Total TTC</span>
                <span className="text-primary">{order.total.toFixed(2)} €</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>Merci pour votre commande !</p>
            <p className="mt-2">QuickBite - contact@quickbite.fr - www.quickbite.fr</p>
            <p>TVA Intracommunautaire: FR12345678901</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Invoice;
