"use client";

import PrevOrder from '@/components/PrevOrder';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import "../../styles/Order.css";

import { fetchPrevOrders, createNewOrder } from '@/pages/api/order';


// Define an interface for the order structure
interface PrevOrderData {
  ao_id: number;    
  ao_amount: number; 
  ao_size: number;   
  ao_timestamp: string; 
  ao_status: string; 
}

export default function OrderPage() {

  const router = useRouter();

  const [prevOrders, setPrevOrders] = useState<PrevOrderData[]>([]); 
  const [size, setSize] = useState(5);
  const [amount, setAmount] = useState(1);

  const account_id = 13; // REPLACE EVENTUALLY
  const machine_id = 1; // REPLACE EVENTUALLY

  // Fetch previous orders when the component mounts
  useEffect(() => {
    const getPrevOrders = async () => {
      const orders = await fetchPrevOrders(account_id); 
      if (orders) { // Ensure data exists before setting state
        setPrevOrders(orders);
      }
    };

    getPrevOrders(); // Call the async function
  }, [account_id]); 



  const handleOrderSelection = (selectedSize: number, selectedAmount: number) => {
    setSize(selectedSize);
    setAmount(selectedAmount);
  };


  const confirmButtonClick = async () => {
    const orderData = {
      account_id: account_id,
      machine_id: machine_id,
      ao_amount: amount,
      ao_size: size,
    };
  
    try {
      const newOrder = await createNewOrder(orderData); // Call the createNewOrder function
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

          {/* Dropdown for Size */}
          <label htmlFor="sizeDropdown">Select Size</label>
          <select
            id="sizeDropdown"
            value={size}
            onChange={(e) => setSize(Number(e.target.value))} // Convert to number
            required
          >
            <option value={5}>5 Inch</option>
            <option value={6}>6 Inch</option>
            <option value={7}>7 Inch</option>
          </select>

          {/* Dropdown for Amount */}
          <label htmlFor="amountDropdown">Select Amount</label>
          <select
            id="amountDropdown"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))} // Convert to number
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


    </div>
  );
}
