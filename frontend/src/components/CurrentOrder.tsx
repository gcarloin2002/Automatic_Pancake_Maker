import React from 'react';
import "../styles/CurrentOrder.css";

interface CurrentOrderProps {
  amount: number;  
  size: number;
  name: string;
  status: string;
}

// The CurrentOrder component that takes amount, size, and name as props
const CurrentOrder: React.FC<CurrentOrderProps> = ({ amount, size, name, status }) => {
  return (
    <div className="CurrentOrder">
        <p className="current-order-status">Status: {status}</p> 
        <p className="current-order-name">Name: {name}</p> 
        <p className="current-order-size">{size}-Inch Pancakes</p>
        <p className="current-order-amount">{amount} Count</p>
        
    </div>
  );
};

export default CurrentOrder;
