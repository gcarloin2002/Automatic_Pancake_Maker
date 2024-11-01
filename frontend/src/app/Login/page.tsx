"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Next.js Router for redirect
import { signIn } from 'next-auth/react';
import logo from '../../assets/logo.png';
import '../../styles/Login.css';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state

  const login_click = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);  // Start loading

    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    setLoading(false);  // Stop loading

    if (result?.error) {
      setError('Login failed. Please check your credentials and try again.');
    } else {
      console.log('Login successful!');
      router.push('/Machine');  // Redirect to Diagnostics page after successful login
    }

    setPassword('');  // Clear password input
  };

  const registration_click = () => {
    router.push('/Registration');  // Redirect to Registration page
  };

  return (
    <>
      <div className="top-bar">
        <Link className="return-button" href="/">{"< Return"}</Link>
      </div>
      <div className="login-box-container">
        <div className="login-box">
          <div className="login-logo-container">
            <Image src={logo} alt="Logo" layout="responsive" objectFit="contain" />
          </div>

          <h1 className="login-title">Login</h1>
          
          {error && <p className="error-msg">{error}</p>}  {/* Display error message */}
          <form className="login-contents" onSubmit={(e) => e.preventDefault()}>
            <label className="login-label">Username/Email</label>
            <input className="login-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="login-label">Password</label>
            <input className="login-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />




          </form>

         
          <div className="login-button-container">
            <button className="login-button" 
              onClick={registration_click}>
              Sign Up
            </button>

            <button 
              className="login-button" 
              onClick={login_click} 
              disabled={loading} // Disable button while loading
            >
              {loading ? "Logging in..." : "Login"}  {/* Show loading state */}
            </button>
          </div>
         
        </div>
      </div>
    </>
  );
}
