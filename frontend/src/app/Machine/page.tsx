import Link from 'next/link';

export default function MachinePage() {
  return (
    <div className="page">
      <h1>Home Page</h1>  
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Home">Go to Home Page</Link>
    </div>
  );
}