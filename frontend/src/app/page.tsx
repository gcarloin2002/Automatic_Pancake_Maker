import Link from 'next/link';
import "./styles.css";


export default function Home() {
  return (
    <div className="page">
      <h1>Automatic Pancake Maker Welcome Page</h1>
      <Link href="/Login">Go to Login Page</Link>
      <Link href="/Registration">Go to Registration Page</Link>
    </div>
  );
}
