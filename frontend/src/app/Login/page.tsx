"use client"; 

import Link from 'next/link';
import { useState } from 'react';
import "./styles.css";
import { signIn } from 'next-auth/react';


export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const login_click = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const result = await signIn('credentials', {
      redirect: false,
      username,
      password,
    });

    if (result?.error) {
      setError('Login failed. Please check your credentials and try again.');
      console.log(error);
    } else {
      console.log('Login successful!');
    }

    setPassword('');
  };
  
  

  return (
    <div className="page">
      <h1>Login Page</h1>  

      {/* Links to different pages */}
      <div className="page">
        <Link href="/Home">Go to Home Page</Link>
        <Link href="/Registration">Go to Registration Page</Link>
        <Link href="/">Go to Welcome Page</Link>
      </div>


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
        <input type="submit" value="Login" />
      </form>

     
    </div>
  );
}
