import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { CartItem } from './CartContext';

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivering' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  items: CartItem[];
  status: OrderStatus;
  total: number;
  deliveryFee: number;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  restaurantId: string;
  restaurantName: string;
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  invoiceNumber: string;
}

interface OrderContextType {
  orders: Order[];
  createOrder: (items: CartItem[], customerInfo: { name: string; address: string; phone: string }) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;
  getOrdersByStatus: (status: OrderStatus) => Order[];
  getPendingOrders: () => Order[];
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const generateOrderId = () => `ORD-${Date.now().toString(36).toUpperCase()}`;
const generateInvoiceNumber = () => `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 10000)).padStart(5, '0')}`;

export const OrderProvider = ({ children }: { children: ReactNode }) => {
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('quickbite-orders');
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((order: Order) => ({
        ...order,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
        estimatedDelivery: order.estimatedDelivery ? new Date(order.estimatedDelivery) : undefined
      }));
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('quickbite-orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (items: CartItem[], customerInfo: { name: string; address: string; phone: string }): Order => {
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const deliveryFee = 2.99;
    
    const newOrder: Order = {
      id: generateOrderId(),
      items,
      status: 'pending',
      total: subtotal + deliveryFee,
      deliveryFee,
      customerName: customerInfo.name,
      customerAddress: customerInfo.address,
      customerPhone: customerInfo.phone,
      restaurantId: items[0]?.restaurantId || '',
      restaurantName: items[0]?.restaurantName || '',
      createdAt: new Date(),
      updatedAt: new Date(),
      estimatedDelivery: new Date(Date.now() + 45 * 60 * 1000),
      invoiceNumber: generateInvoiceNumber()
    };

    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId 
        ? { ...order, status, updatedAt: new Date() }
        : order
    ));
  };

  const getOrderById = (orderId: string) => orders.find(o => o.id === orderId);
  
  const getOrdersByStatus = (status: OrderStatus) => orders.filter(o => o.status === status);
  
  const getPendingOrders = () => orders.filter(o => 
    o.status === 'pending' || o.status === 'preparing' || o.status === 'ready' || o.status === 'delivering'
  );

  return (
    <OrderContext.Provider value={{
      orders,
      createOrder,
      updateOrderStatus,
      getOrderById,
      getOrdersByStatus,
      getPendingOrders
    }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within OrderProvider');
  return context;
};
