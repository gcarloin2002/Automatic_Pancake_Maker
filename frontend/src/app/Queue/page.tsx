"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import "../../styles/Queue.css";

import CurrentOrder from '@/components/CurrentOrder';
import { fetchQueue } from '@/pages/api/queue';
import LogoutButton from '@/components/LogoutButton';

// Define the interface for CurrentOrder
interface CurrentOrder {
    ao_id: number;
    account_id: number;
    machine_id: number;
    ao_amount: number;
    ao_size: string;
    ao_status: string;
    ao_timestamp: string;
    account_first_name: string;
    account_last_name: string;
}

const machine_id = 1; // Example machine_id

export default function QueuePage() {
  const [currentQueue, setCurrentQueue] = useState<CurrentOrder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  

  // Helper function to check if the queue has changed
  const hasQueueChanged = (newQueue: CurrentOrder[] | null) => {
    if (!currentQueue || !newQueue) return true; // If either is null, assume it changed
    if (currentQueue.length !== newQueue.length) return true; // Different lengths mean data has changed

    // Compare each order in the queue for any changes
    return currentQueue.some((order, index) => (
      order.ao_id !== newQueue[index].ao_id ||
      order.ao_amount !== newQueue[index].ao_amount ||
      order.ao_size !== newQueue[index].ao_size ||
      order.ao_status !== newQueue[index].ao_status
    ));
  };

  useEffect(() => {
    const fetchQueueData = async () => {
      const queue = await fetchQueue(machine_id);

      if (hasQueueChanged(queue)) {
        setCurrentQueue(queue); // Update state if the queue data has changed
      }

      setLoading(false); // Set loading to false after the initial load
    };

    // Initial fetch on mount and set interval to fetch every second
    fetchQueueData();
    const intervalId = setInterval(fetchQueueData, 1000);

    // Clear interval on component unmount to prevent memory leaks
    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="page">
      <h1>Queue Page</h1>
      <LogoutButton />  
      <Link href="/Home">Go to Home Page</Link>

      {/* Render loading state only on initial load */}
      {loading ? (
        <p>Loading queue...</p>
      ) : (
        currentQueue && currentQueue.length > 0 ? (
          currentQueue.map((order) => (
            <CurrentOrder 
              key={order.ao_id} 
              size={parseInt(order.ao_size)} 
              amount={order.ao_amount} 
              name={`${order.account_first_name} ${order.account_last_name}`} 
              status={order.ao_status}
            />
          ))
        ) : (
          <p>No orders found</p>
        )
      )}
    </div>
  );
}
