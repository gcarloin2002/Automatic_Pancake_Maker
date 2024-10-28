import Link from 'next/link';
/*
import Image from 'next/image';
import logo from "../assets/logo.png"
*/
import "../styles/Welcome.css";


export default function Home() {
  return (
    <div className="welcome">
      <div className="top-bar">
        <Link className="login-button" href="/Login">Login</Link>
      </div>
      <div className="title-card">
        <h1 className="title">Automatic Pancake Maker Welcome Page</h1>
      </div>
      <div>
        collage
      </div>
    </div>
  );
}
