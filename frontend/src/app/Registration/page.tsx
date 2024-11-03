"use client";


import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import '../../styles/Registration.css';
import logo from '../../assets/logo.png';
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
    <>
      <div className="registration-top-bar">
        <Link className="return-button" href="/Login">{"< Return"}</Link>
      </div>
      <div className="registration-box-container">
        <div className="registration-box">

          <div className="registration-logo-container">
            <Image src={logo} alt="Logo" layout="responsive" objectFit="contain" />
          </div>

          <h1 className="registration-title">Registration</h1>


          {error && <p className="error-msg">{error}</p>}
          <form className="registration-contents" onSubmit={handleSubmit}>
            <label className="registration-label">First Name</label>
            <input className="registration-input"
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />

            <label className="registration-label">Last Name</label>
            <input className="registration-input"
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />

            <label className="registration-label">Email</label>
            <input className="registration-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="registration-label">Username</label>
            <input className="registration-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <label className="registration-label">Password</label>
            <input className="registration-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="registration-label">Confirm Password</label>
            <input className="registration-input"
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              required
            />

            
            <div className="registration-button-container">
              <input className="registration-button" type="submit" value="Register" />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
