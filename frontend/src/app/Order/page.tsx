"use client";

import PrevOrder from '@/components/PrevOrder';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import "../../styles/Order.css";

// Define an interface for the order structure
interface PrevOrderData {
  ao_id: number;     // Assuming ao_id is a number
  ao_amount: number; // Assuming ao_amount is a number
  ao_size: number;   // Assuming ao_size is a number
  ao_timestamp: string; // Assuming ao_timestamp is a string
  ao_status: string;  // Assuming ao_status is a string
}

export default function OrderPage() {
  const [prevOrders, setPrevOrders] = useState<PrevOrderData[]>([]); // State to hold previous orders
  const accountId = 13; // Replace with actual logic to get the account_id dynamically

  // Fetch previous orders when the component mounts
  useEffect(() => {
    const fetchPrevOrders = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/account_order/${accountId}`); // Adjust the API endpoint as needed
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        const data = await response.json();
        setPrevOrders(data); // Store fetched orders in state
      } catch (error) {
        console.error('Error fetching previous orders:', error);
      }
    };

    fetchPrevOrders();
  }, []); // Dependency array to fetch orders when accountId changes

  return (
    <div className="Order">
      <Link href="/Home">Go to Home Page</Link> 
      <h1>Order Again</h1>  

      <div className="PrevOrders">
        {prevOrders.map((order) => (
          <PrevOrder key={order.ao_id} amount={order.ao_amount} size={order.ao_size} />
        ))}
      </div>
    </div>
  );
}
