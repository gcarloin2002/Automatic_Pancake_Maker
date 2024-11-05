"use client";

import { useSession } from 'next-auth/react';
import PrevOrder from '@/components/PrevOrder';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/Order.css";

import { fetchPrevOrders, createNewOrder } from '@/pages/api/order';
import { fetchQueue } from '@/pages/api/queue';


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

export default function OrderPage() {

  const { data: session, status } = useSession();
  const router = useRouter();

  const [prevOrders, setPrevOrders] = useState<PrevOrderData[]>([]);
  const [size, setSize] = useState(5);
  const [amount, setAmount] = useState(1);
  const [queueLimitExceeded, setQueueLimitExceeded] = useState(false);
  const [showQueueFullMessage, setShowQueueFullMessage] = useState(false); // Tracks if the message should show

  const account_id = Number(session?.user ? (session.user as CustomUser).id : "User");
  const machine_id = 1;

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
    <div className="Order">
      <Link href="/Home"> {"<-Back"} </Link>
      <h1>Order Again</h1>  

      <div className="PrevOrders">
        {prevOrders.map((order) => (
          <PrevOrder key={order.ao_id} amount={order.ao_amount} size={order.ao_size} onSelectOrder={handleOrderSelection}/>
        ))}
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
            <option value={1}>1 Count</option>
            <option value={2}>2 Count</option>
            <option value={3}>3 Count</option>
            <option value={4}>4 Count</option>
            <option value={5}>5 Count</option>
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
  );
}
