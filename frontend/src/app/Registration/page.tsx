"use client"; 

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "./styles.css";
import { hashPassword } from '../global_helpers';
import * as helpers from './helpers'

import { useState } from 'react';

export default function RegistrationPage() {

  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [email, setEmail] = useState('');
  const [usedEmail, setUsedEmail] = useState(false)

  const [username, setUsername] = useState('');
  const [usedUsername, setUsedUsername] = useState(false)


  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [matchedPasswords, setMatchedPasswords] = useState(true)




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();
    let invalidForm = false

     
    // First check if username hasn't been used
    try {
      const usernameExists = await helpers.checkUsernameExists(username); 
      setUsedUsername(usernameExists ? true : false)

      if (usernameExists){
        invalidForm = true
      }

       

    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }

 
     
    // Then check if email hasn't been used
    try {
      const emailExists = await helpers.checkEmailExists(email); 
      setUsedEmail(emailExists ? true : false)

      if (emailExists){
        invalidForm = true
      }

       

    } catch (error) {
      console.error('Failed to fetch account details:', error);
    }


    

    // Check if passwords match
    setMatchedPasswords(password === password2 ? true : false)
    if (password !== password2){
      invalidForm = true
    }

     



    // If all registration boxes are valid
    if (!invalidForm){
      
      const formData = {
        account_first_name: firstName,
        account_last_name: lastName,
        account_email: email,
        account_username: username,
        account_password: hashPassword(password, username) 
      };

      // Creates new account
      helpers.createNewAccount(formData)
      await router.push('/Login');
    }

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


        {usedEmail && <p>Email already in use</p>}
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        {usedUsername && <p>Username already in use</p>}  
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

        {!matchedPasswords && <p>Passwords do not match</p>}  
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
