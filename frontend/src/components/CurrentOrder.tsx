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
        <p>{size}-Inch Pancakes</p>
        <p>{amount} Count</p>
        <p>Name: {name}</p> 
        <p>Status: {status}</p> 
    </div>
  );
};

export default CurrentOrder;
