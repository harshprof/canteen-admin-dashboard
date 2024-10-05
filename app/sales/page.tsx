'use client'; // Make sure this component is client-side

import { useEffect, useState } from 'react';
import { collection, getDocs, updateDoc, doc, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase'; // Ensure path to firebaseConfig is correct

interface Order {
  id: string;
  orderId: number;  // Change orderId to a number
  totalAmount: number;
  createdAt: any;
  isOrderPending: boolean;
  userId: string;
}

export default function SalesPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // Ensure the orderId is treated as a number during sorting
        const ordersCollection = query(collection(db, 'orders'), orderBy('orderId', 'asc'));
        const ordersSnapshot = await getDocs(ordersCollection);
        const ordersList = ordersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Order[];

        setOrders(ordersList);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Function to mark order as completed
  const markAsCompleted = async (orderId: string) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        isOrderPending: false,
      });
      // Update local state after marking the order as completed
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, isOrderPending: false } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  // Filter orders based on the selected filter
  const filteredOrders = orders.filter(order => {
    if (filter === 'completed') return !order.isOrderPending;
    if (filter === 'pending') return order.isOrderPending;
    return true; // Return all orders if no filter is applied
  });

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-black">Orders</h1>

      {/* Filter Buttons */}
      <div className="mb-4">
        <button
          className={`mr-2 px-4 py-2 ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setFilter('all')}
        >
          All Orders
        </button>
        <button
          className={`mr-2 px-4 py-2 ${filter === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setFilter('pending')}
        >
          Pending Orders
        </button>
        <button
          className={`px-4 py-2 ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-black'}`}
          onClick={() => setFilter('completed')}
        >
          Completed Orders
        </button>
      </div>

      {loading ? (
        <p className="text-black">Loading...</p>
      ) : (
        <table className="table-auto w-full text-black">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Total Amount</th>
              <th>Created At</th>
              <th>Order Status</th>
              <th>User ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order) => (
              <tr key={order.id}>
                <td>{order.orderId}</td>
                <td>₹{order.totalAmount}</td>
                <td>{new Date(order.createdAt.seconds * 1000).toLocaleDateString()}</td>
                <td>{order.isOrderPending ? 'Pending' : 'Completed'}</td>
                <td>{order.userId}</td>
                <td>
                  {order.isOrderPending && (
                    <button
                      className="bg-blue-500 text-white px-2 py-1 rounded"
                      onClick={() => markAsCompleted(order.id)}
                    >
                      Mark as Completed
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
