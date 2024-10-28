"use client";

import Link from 'next/link';
import { useEffect, useState } from 'react';
import "../../styles/Queue.css";

import CurrentOrder from '@/components/CurrentOrder'; // Assuming CurrentOrder takes size, amount, and name props
import { fetchQueue } from '@/pages/api/queue'; // Ensure this imports your new fetchQueue function
import LogoutButton from '@/components/LogoutButton';

// Define the interface for CurrentOrder, same as the one used in fetchQueue
interface CurrentOrder {
    ao_id: number;
    account_id: number;
    machine_id: number;
    ao_amount: number;
    ao_size: string;
    ao_status: string;
    ao_timestamp: string; // ISO 8601 format
    account_first_name: string;
    account_last_name: string;
}

// Define the machine_id to use
const machine_id = 1; // Example machine_id

export default function QueuePage() {
  // State to hold the fetched queue
  const [currentQueue, setCurrentQueue] = useState<CurrentOrder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Loading state to handle while data is being fetched

  // Fetch queue on component mount using useEffect
  useEffect(() => {
    const fetchQueueData = async () => {
      setLoading(true); // Set loading to true before fetching
      const queue = await fetchQueue(machine_id); // Fetch queue by machine_id
      
      // Update state with the fetched queue
      setCurrentQueue(queue); 
      setLoading(false); // Set loading to false once the fetch is done
    };

    fetchQueueData(); // Initial fetch on mount
  }, []);

  return (
    <div className="page">
      <h1>Queue Page</h1>
      <LogoutButton />  
      <Link href="/Home">Go to Home Page</Link>

      {/* Render the loading state if loading */}
      {loading && <p>Loading queue...</p>}

      {/* Render the current queue */}
      {!loading && currentQueue ? (
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
        !loading && <p>No orders found</p>
      )}
    </div>
  );
}
