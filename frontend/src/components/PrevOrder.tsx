import React from 'react';


import "../styles/PrevOrder.css"

interface PrevOrderProps {
  amount: number;  
  size: number;
  onSelectOrder: (size: number, amount: number) => void;
}

// The PrevOrder component that takes amount and size as props
const PrevOrder: React.FC<PrevOrderProps> = ({ amount, size, onSelectOrder }) => {

  const handleClick = () => {
    onSelectOrder(size, amount); // Call the function passed by parent, passing the size and amount
  };

  return (
    <button className="prev-order" onClick={handleClick}>
      <p className="prev-order-info">{size}-Inch Pancakes</p>
      <p className="prev-order-info">{amount} Count </p>
    </button>
  );
};

export default PrevOrder;
