import LogoutButton from '@/components/LogoutButton';
import Link from 'next/link';

export default function HomePage() {
  return (
    <>
      <h1>Home Page</h1>  
      <LogoutButton />
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Order">Go to Order Page</Link>
      <Link href="/Queue">Go to Queue Page</Link>
      <Link href="/Diagnostics">Go to Diagnostics Page</Link>
    </>
  );
}