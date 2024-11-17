"use client";

import { signOut } from 'next-auth/react';
import { useSession } from 'next-auth/react';
import PrevOrder from '@/components/PrevOrder';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/Order.css";

import { fetchPrevOrders, createNewOrder } from '@/pages/api/order';
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

interface PrevOrderData {
  ao_id: number;    
  ao_amount: number; 
  ao_size: number;   
  ao_timestamp: string; 
  ao_status: string; 
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
}

export default function OrderPage() {

  const { data: session, status } = useSession();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [secondsApart, setSecondsApart] = useState<number>(0);
  const router = useRouter();
  const machine_id = 1; // Replace with the actual machine ID you want to fetch

  const [prevOrders, setPrevOrders] = useState<PrevOrderData[]>([]);
  const [size, setSize] = useState(5);
  const [amount, setAmount] = useState(2);
  const [queueLimitExceeded, setQueueLimitExceeded] = useState(false);
  const [showQueueFullMessage, setShowQueueFullMessage] = useState(false); // Tracks if the message should show
  const account_id = Number(session?.user ? (session.user as CustomUser).id : "User");


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

  // Fetch previous orders when the component mounts
  useEffect(() => {
    const getPrevOrders = async () => {
      const orders = await fetchPrevOrders(account_id);
      if (orders) { 
        setPrevOrders(orders);
      }
    };

    getPrevOrders();
  }, [account_id]);

  const handleOrderSelection = (selectedSize: number, selectedAmount: number) => {
    setSize(selectedSize);
    setAmount(selectedAmount);
  };

  const confirmButtonClick = async () => {
    const queue = await fetchQueue(machine_id);
    
    // Check if queue limit is exceeded
    if (queue && queue.length >= 5) {
      setQueueLimitExceeded(true);
      setShowQueueFullMessage(true); // Show the message if queue is full
      return;
    }

    // Proceed with creating a new order if the queue limit is not exceeded
    const orderData = {
      account_id: account_id,
      machine_id: machine_id,
      ao_amount: amount,
      ao_size: size,
    };
  
    try {
      const newOrder = await createNewOrder(orderData);
      if (newOrder) {
        console.log('Order successfully created:', newOrder);
        router.push('/Queue');
      } else {
        console.log('Failed to create order.');
      }
    } catch (error) {
      console.error('Error during order creation:', error);
    }
  };

  return (
    <>
      <div className="order-top-bar">
        <Link className="return-button" href="/Home">{"< Return"}</Link>
        <p className="invis">{machine?.machine_id}</p>
      </div>

      <div className="order-container">
        <h1 className="order-title">Order Again</h1>
        <div className="prev-orders">
          <div className="prev-orders-container">
            {prevOrders.map((order) => (
              <PrevOrder key={order.ao_id} amount={order.ao_amount} size={order.ao_size} onSelectOrder={handleOrderSelection}/>
            ))}
          </div>
        </div>

        
        <div className="lower-order-section">
          <div className="create-new-order">
            <h1>Create New Order</h1>

            <label htmlFor="sizeDropdown">Select Size</label>
            <select
              id="sizeDropdown"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              required
            >
              <option value={5}>5 Inch</option>
              <option value={6}>6 Inch</option>
              <option value={7}>7 Inch</option>
            </select>

            <label htmlFor="amountDropdown">Select Amount</label>
            <select
              id="amountDropdown"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              required
            >
              <option value={2}>2 Count</option>
              <option value={4}>4 Count</option>
              <option value={6}>6 Count</option>
            </select>

          </div>

          <div className="finalize-order">
            <h1>Final Order</h1>
            <p>{size}-Inch, {amount} Count</p>
          </div>
        </div>

        <button onClick={confirmButtonClick}>
          Confirm Order
        </button>

        {/* Display the "Queue is full" message only if the button was clicked and the queue limit is exceeded */}
        {showQueueFullMessage && queueLimitExceeded && (
          <p style={{ color: 'red', marginTop: '10px' }}>
            Queue is full. Please wait for an available slot before placing a new order.
          </p>
        )}
      </div>
    </>
  );
}
