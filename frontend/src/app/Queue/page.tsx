import Link from 'next/link';
import "./styles.css";

// Started on Queue branch  

export default function QueuePage() {
  return (
    <div className="page">
      <h1>Queue Page</h1>  
      <Link href="/Home">Go to Home Page</Link>
    </div>
  );
}