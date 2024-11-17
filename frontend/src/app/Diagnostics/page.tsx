"use client";  

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine';
import '../../styles/Diagnostics.css';


const refreshRate = 5000
const secondsThreshold = 10;
const delay = process.env.NEXT_PUBLIC_DELAY;

// Define the custom user type with 'username' and 'role'
interface CustomUser {
  id: string;
  username: string;
  role: string;
  email?: string | null;
  image?: string | null;
  machine_id? : number | null;
}

interface Machine {
  machine_id: number;
  machine_network: string;
  machine_name: string;
  machine_street: string;
  machine_city: string;
  machine_state: string;
  machine_zip_code: string;
  machine_timestamp: string;
  machine_temperature: number;
  machine_batter: number;
}

export default function DiagnosticsPage() {
  const { data: session, status } = useSession();
  const [machine, setMachine] = useState<Machine | null>(null);
  const [secondsApart, setSecondsApart] = useState<number>(0);
  const router = useRouter();
  const machine_id = 1; // Replace with the actual machine ID you want to fetch

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

  const handleLogout = () => {
    localStorage.removeItem('machine_id');  // Clear machine_id from local storage
    signOut({
      callbackUrl: '/',  // Redirect to homepage after logout
    });
  };

    // Fetch machine data and calculate seconds apart
    const fetchMachineData = async () => {
      try {
        const fetchedMachine = await getMachineById(machine_id);
        if (fetchedMachine) {
          const formattedTimestamp = convertToDatabaseFormat(fetchedMachine.machine_timestamp);
          const updatedMachine: Machine = {
            ...fetchedMachine,
            machine_timestamp: formattedTimestamp,
          };
          
          setMachine(updatedMachine);
          const seconds = Math.abs(calculateSecondsApart(formattedTimestamp) + Number(delay));
          setSecondsApart(seconds);
        }
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };
  
    // Set interval to fetch machine data every second
    useEffect(() => {
      fetchMachineData();
      const intervalId = setInterval(fetchMachineData, refreshRate);
      return () => clearInterval(intervalId);
    }, [machine_id]);
  
    // Trigger logout if secondsApart exceeds threshold
    useEffect(() => {
      if (secondsApart > secondsThreshold) {
        handleLogout();
      }
    }, [secondsApart]);


  if (status === 'loading') {
    return <p>Loading...</p>;
  }

  return (
    <>
      <div className="d-top-bar">
        <Link className="return-button" href="/Home">{"< Return"}</Link>
      </div>
      <div className="d-container">
        <h1 className="d-title">Diagnostics</h1>
        <div className="d-boxes">
          <div className="d-box">
            <p className="d-box-title">Temperature</p>
            <p className="d-box-value">{machine?.machine_temperature + "°F"}</p>

          </div>

          <div className="d-box">
            <p className="d-box-title">Batter</p>
            <p className="d-box-value">{machine?.machine_batter}</p>
          </div>

        </div>
      </div>
    </>
  );
}
