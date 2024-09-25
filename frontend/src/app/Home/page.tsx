import Link from 'next/link';

export default function HomePage() {
  return (
    <div>
      <h1>Home Page</h1>  
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Order">Go to Order Page</Link>
      <Link href="/Order">Go to Queue Page</Link>
      <Link href="/Diagnostics">Go to Diagnostics Page</Link>
    </div>
  );
}