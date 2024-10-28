"use client";

import { signOut } from 'next-auth/react';

export default function LogoutButton() {
    const handleLogout = () => {
        localStorage.removeItem('machine_id');  // Clear machine_id from local storage
        signOut({
          callbackUrl: '/',  // Redirect to homepage after logout
        });
      };
      

  return (
    <button onClick={handleLogout}>
      Logout
    </button>
  );
}
