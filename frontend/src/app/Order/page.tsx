import Link from 'next/link';
import "./styles.css";

// Starting order


export default function OrderPage() {
  return (
    <div className="page">
      <h1>Order Page</h1>  
      <Link href="/Home">Go to Home Page</Link>
    </div>
  );
}