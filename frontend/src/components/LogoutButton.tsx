"use client";

import { signOut } from 'next-auth/react';
import "../styles/LogoutButton.css";

export default function LogoutButton() {
    const handleLogout = () => {
        localStorage.removeItem('machine_id');  // Clear machine_id from local storage
        signOut({
          callbackUrl: '/',  // Redirect to homepage after logout
        });
      };
      

  return (
    <>
      <button className="logout-button" onClick={handleLogout}> {"<"}</button>
    </>
  );
}
