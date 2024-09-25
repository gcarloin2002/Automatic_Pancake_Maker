import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Automatic Pancake Maker Welcome Page</h1>
      <Link href="/Login">Go to Login Page</Link>
      <Link href="/Registration">Go to Registration Page</Link>
    </div>
  );
}
