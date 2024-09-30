import Link from 'next/link';
import "./styles.css";

export default function DiagnosticsPage() {
  return (
    <div className="page">
      <h1>Diagnostics Page</h1>  
      <Link href="/Home">Go to Home Page</Link>
    </div>
  );
}