import Link from 'next/link';
import "./styles.css";

export default function LoginPage() {
  return (
    <div className="page">
      <h1>Login Page</h1>  
      <Link href="/Home">Go to Home Page</Link>
      <Link href="/Registration">Go to Registration Page</Link>
      <Link href="/">Go to Welcome Page</Link>
    </div>
  );
}