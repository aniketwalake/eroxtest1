import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from './firebase'; // Replace with your Firebase config
import "./OrdersAndFilesPage.css"

function OrdersList() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const orderList = ordersSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setOrders(orderList);
    };

    getOrders();
  }, []);

  return (
    <div className="orders-container">
      <h2>Orders Received</h2>
      {orders.length > 0 ? (
        <table className="orders-table">
          <thead>
            <tr>
              <th>Filename</th>
              <th>Pages</th>
              <th>Copies</th>
              <th>Print Type</th>
              <th>Customer Name</th>
              <th>Mobile Number</th>
              <th>Total Cost (Rs.)</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.filename}</td>
                <td>{order.numPages}</td>
                <td>{order.numCopies}</td>
                <td>{order.printType}</td>
                <td>{order.userName}</td>
                <td>{order.mobileNumber}</td>
                <td>{order.totalCost}</td>
                <td>{order.timestamp ? order.timestamp.toDate().toString() : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No orders received yet.</p>
      )}
    </div>
  );
}

export default OrdersList;

