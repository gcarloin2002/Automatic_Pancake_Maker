import React from 'react';


import "../styles/PrevOrder.css"

interface PrevOrderProps {
  amount: number;  
  size: number;   
}

// The PrevOrder component that takes amount and size as props
const PrevOrder: React.FC<PrevOrderProps> = ({ amount, size }) => {
  return (
    <button className="PrevOrder">
        <p>{size}-Inch Pancakes</p>
        <p>{amount} Count </p>
    </button>
  );
};

export default PrevOrder;
