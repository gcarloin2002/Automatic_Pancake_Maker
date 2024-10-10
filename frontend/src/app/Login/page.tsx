"use client"; 

import Link from 'next/link';
import { useState } from 'react';
import "./styles.css";
import { hashPassword } from '../global_helpers';
import *  as loginHelpers from './login_helpers';

export default function LoginPage() {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [login, setLogin] = useState(false);


  const login_click = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    const hashedPassword = hashPassword(password, username);
    const loginStatus = await loginHelpers.checkLogin(hashedPassword, username);
    setLogin(loginStatus ? true : false);
    if (login) {
      console.log("Login Success!");
    }
    else {
      console.log("Login failed!");
    }
    setPassword("");
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
