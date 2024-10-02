"use client"; 

import Link from 'next/link';
import "./styles.css";
import { hashPassword } from '../global_helpers';
import * as helpers from './helpers'

import { useState } from 'react';

export default function RegistrationPage() {


  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  //const [usedEmail, setUsedEmail] = useState(false)

  const [username, setUsername] = useState('');
  //const [usedUsername, setUsedUsername] = useState(false)


  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  //const [unmatchedPasswords, setUnmatchedPasswords] = useState('')




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

    
    try {

      // First check if username hasn't been used
      const usernameExists = await helpers.checkUsernameExists(baseUrl, username); 
      console.log("Username Exists: " + usernameExists)

    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }



    try {
      
      // Then check if email hasn't been used
      const emailExists = await helpers.checkEmailExists(baseUrl, email); 
      console.log("Email Exists: " + emailExists)

    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }



    





    const formData = {
      firstName,
      lastName,
      email,
      username,
      hashedPassword: hashPassword(password, "7") 
    };

    console.log(formData)
  };

  
  return (
    <div className="page">
      <h1>Registration Page</h1>
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Login">Go to Login Page</Link>


      <form className="page" onSubmit={handleSubmit}>
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

        <label>Re-Enter Password</label>
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
        />

        <input type="submit" value="Submit" />
      </form>


    </div>
  );
}