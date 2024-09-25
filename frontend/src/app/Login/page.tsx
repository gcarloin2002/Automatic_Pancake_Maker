import Link from 'next/link';

export default function LoginPage() {
  return (
    <div>
      <h1>Login Page</h1>  
      <Link href="/Home">Go to Home Page</Link>
      <Link href="/Registration">Go to Registration Page</Link>
      <Link href="/">Go to Welcome Page</Link>
    </div>
  );
}