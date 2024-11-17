"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import "../../styles/Queue.css";

import CurrentOrder from '@/components/CurrentOrder';
import { fetchQueue } from '@/pages/api/queue';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine';


const refreshRate = 5000
const secondsThreshold = 10;
const delay = process.env.NEXT_PUBLIC_DELAY;


interface CustomUser {
  id: string;
  username: string;
  role: string;
  email?: string | null;
  image?: string | null;
  machine_id? : number | null;
}

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

interface Machine {
  machine_id: number;
  machine_network: string;
  machine_name: string;
  machine_street: string;
  machine_city: string;
  machine_state: string;
  machine_zip_code: string;
  machine_timestamp: string;
  machine_temperature: number;
  machine_batter: number;
  machine_mode: string;
}

const machine_id = 1; // Example machine_id

export default function QueuePage() {
  const { data: session, status } = useSession();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [secondsApart, setSecondsApart] = useState<number>(0);
  const [currentQueue, setCurrentQueue] = useState<CurrentOrder[] | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  
  const router = useRouter();

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
    if (status === 'loading') return;

    // Log session to check its structure
    console.log("Session Data:", session); 

    // Cast session.user to CustomUser to access 'username' and 'role'
    const user = session?.user as CustomUser | undefined;

    if (!user || user.role !== 'admin') {
      router.push('/');  // Redirect if the user is not an admin
    }
  }, [session, status, router]);


  const handleLogout = () => {
    localStorage.removeItem('machine_id');  // Clear machine_id from local storage
    signOut({
      callbackUrl: '/',  // Redirect to homepage after logout
    });
  };

  // Fetch machine data and calculate seconds apart
  const fetchMachineData = async () => {
    try {
      const fetchedMachine = await getMachineById(machine_id);
      if (fetchedMachine) {
        const formattedTimestamp = convertToDatabaseFormat(fetchedMachine.machine_timestamp);
        const updatedMachine: Machine = {
          ...fetchedMachine,
          machine_timestamp: formattedTimestamp,
        };
        
        setMachine(updatedMachine);
        const seconds = Math.abs(calculateSecondsApart(formattedTimestamp) + Number(delay));
        setSecondsApart(seconds);
      }
    } catch (error) {
      console.error('Error fetching machine data:', error);
    }
  };

  // Set interval to fetch machine data every second
  useEffect(() => {
    fetchMachineData();
    const intervalId = setInterval(fetchMachineData, refreshRate);
    return () => clearInterval(intervalId);
  }, [machine_id]);

  // Trigger logout if secondsApart exceeds threshold
  useEffect(() => {
    if (secondsApart > secondsThreshold) {
      handleLogout();
    }
  }, [secondsApart]);

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
    <>
      <div className="queue-top-bar">
        <Link className="return-button" href="/Home">{"< Return"}</Link>
        <p className="invis">{machine?.machine_id}</p>
      </div>

      <div className="queue-container">
        <h1 className="queue-title">Queue</h1>
        <div className="current-orders">
          {loading ? (
            <p className="loading-orders">Loading queue...</p>
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
              <p className="no-orders">No orders found</p>
            )
          )}
        </div>
        
      </div>
    </>
  );
}
