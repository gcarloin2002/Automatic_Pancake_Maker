import Link from 'next/link';
import "./styles.css";

export default function RegistrationPage() {
  return (
    <div className="page">
      <h1>Registration Page</h1>
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Login">Go to Login Page</Link>
    </div>
  );
}