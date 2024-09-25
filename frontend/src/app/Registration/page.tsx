import Link from 'next/link';

export default function RegistrationPage() {
  return (
    <div>
      <h1>Registration Page</h1>
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Login">Go to Login Page</Link>
    </div>
  );
}