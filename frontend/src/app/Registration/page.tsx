"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import "./styles.css";
import { hashPassword } from '../global_helpers';


export default function RegistrationPage() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Check if passwords match
    if (password !== password2) {
      setError('Passwords do not match');
      return;
    }
    const hashedPassword = hashPassword(password, username);

    // Send registration data to the API
    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        account_first_name: firstName,
        account_last_name: lastName,
        account_email: email,
        account_username: username,
        account_password: hashedPassword,
      }),
    });

    if (res.ok) {
      router.push('/Login');  // Redirect to login after successful registration
    } else {
      const errorData = await res.json();
      setError(errorData.message);
    }
  };

  return (
    <div className="page">
      <h1>Registration Page</h1>

      <div className="page">
        <Link href="/Home">Go to Home Page</Link>
        <Link href="/Login">Go to Login Page</Link>
        <Link href="/">Go to Welcome Page</Link>
      </div>

      <form onSubmit={handleSubmit}>
        <label>First Name</label>
        <input
          type="text"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />

        <label>Last Name</label>
        <input
          type="text"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label>Username</label>
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

        <label>Confirm Password</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <input type="submit" value="Register" />
      </form>
    </div>
  );
}
