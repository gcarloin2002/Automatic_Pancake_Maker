"use client";

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/react';
import Image from 'next/image';
import logo from '../../assets/logo.png';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import '../../styles/Home.css';
import order_icon from '../../assets/order-icon.png';
import queue_icon from '../../assets/queue-icon.png';
import diagnostics_icon from '../../assets/diagnostics-icon.png';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine';


const refreshRate = 5000
const secondsThreshold = 10;
const delay = process.env.NEXT_PUBLIC_DELAY;


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
  machine_batter: boolean;
}

export default function HomePage() {
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

  // Navigation functions
  const order_click = () => {
    router.push('/Order');
  };

  const queue_click = () => {
    router.push('/Queue');
  };

  const diagnostics_click = () => {
    router.push('/Diagnostics');
  };

  return (
    <>
      <div className="home-top-bar-gap"></div>
      <div className="home-top-bar">
        <LogoutButton/>
        <h1 className="home-message">Welcome {session?.user ? (session.user as CustomUser).username : "User"}</h1>
        <p className="invis">{machine?.machine_id}</p>
        <div className="home-logo-container">
          <Image src={logo} alt="Logo" layout="responsive" objectFit="contain" />
        </div>
      </div>

      <div className="home-buttons-container">
        <div className="home-buttons">
          <button className="home-button home-button-1" onClick={order_click}>
            <div className="home-img-container">
              <Image src={order_icon} alt="Logo" layout="responsive" objectFit="contain" />
            </div>
            <h1 className="home-button-label">Order</h1>
          </button>
          <button className="home-button home-button-2" onClick={queue_click}>
            <div className="home-img-container">
              <Image src={queue_icon} alt="Logo" width="250" />
            </div>
            <h1 className="home-button-label">Queue</h1>
          </button>
          <button className="home-button home-button-3" onClick={diagnostics_click}>
            <div className="home-img-container">
              <Image src={diagnostics_icon} alt="Logo" layout="responsive" objectFit="contain" />
            </div>
            <h1 className="home-button-label">Diagnostics</h1>
          </button>
        </div>
      </div>
    </>
  );
}
