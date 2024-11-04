"use client";  

import Link from 'next/link';
import LogoutButton from '@/components/LogoutButton';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define the custom user type with 'username' and 'role'
interface CustomUser {
  id: string;
  username: string;
  role: string;
  email?: string | null;
  image?: string | null;
  machine_id? : number | null;
}

export default function DiagnosticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [machineId, setMachineId] = useState<string | null>(null);

  useEffect(() => {
    // Retrieve machine_id from local storage
    const storedMachineId = localStorage.getItem('machine_id');
    setMachineId(storedMachineId);
  }, []);

  useEffect(() => {
    if (status === 'loading') return;

    // Log session to check its structure
    console.log("Session Data:", session); 

    // Cast session.user to CustomUser to access 'username' and 'role'
    const user = session?.user as CustomUser | undefined;

    if (!user || user.role !== 'admin') {
      router.push('/');  // Redirect if the user is not an admin
    }
  }, [session, status, router]);

  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <Link href="/Home">Go to Home Page</Link>
      <h1>Diagnostics</h1>
      <LogoutButton />
      {/* Access 'username' safely by casting session.user */}
      <p>Welcome, {session?.user ? (session.user as CustomUser).username : "User"}. This is the admin section.</p>
      <p>Machine, {machineId}. This is the machine admin section.</p>
    </div>
  );
}
