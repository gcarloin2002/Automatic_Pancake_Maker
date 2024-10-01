import Link from 'next/link';
import "./styles.css";

export default function RegistrationPage() {


  
  return (
    <div className="page">
      <h1>Registration Page</h1>
      <Link href="/">Go to Welcome Page</Link>
      <Link href="/Login">Go to Login Page</Link>


      <form>
        <label>Username or Password</label>
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