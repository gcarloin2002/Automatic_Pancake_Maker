"use client";

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';  // Next.js Router for redirect
import { signIn } from 'next-auth/react';
import '../../styles/Login.css';


export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Loading state

  const login_click = async (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <>
      <div className="top-bar">
        <Link className="return-button" href="/">{"< Return"}</Link>
      </div>

      

      <div className="login-box-container">
        <div className="login-box">
          <form onSubmit={login_click}>
            <label>Username or Email</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && <p style={{ color: 'red' }}>{error}</p>}  {/* Display error message */}

            <input type="submit" value={loading ? "Logging in..." : "Login"} disabled={loading} /> {/* Show loading state */}
          </form>

          {loading && <p>Loading...</p>}  {/* Show loading spinner */}
          <Link href="/Registration">Sign Up</Link>
        </div>
      </div>
    </>
  );
}
