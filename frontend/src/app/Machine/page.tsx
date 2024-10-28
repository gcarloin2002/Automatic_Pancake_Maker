"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "../../styles/Machine.css";
import { useState, useEffect } from 'react';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine';


const secondsThreshold = 5
const delay = process.env.NEXT_PUBLIC_DELAY

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

export default function MachinePage() {
  const [machine, setMachine] = useState<Machine | null>(null);
  const [secondsApart, setSecondsApart] = useState<number>(0);
  const router = useRouter();

  const machine_id = 1; // Replace with the actual machine ID you want to fetch

  useEffect(() => {
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

    fetchMachineData();

    const intervalId = setInterval(fetchMachineData, 1000);

    return () => clearInterval(intervalId);
  }, [machine_id]);

  // Function to handle machine selection
  const handleMachineSelect = async () => {
    if (secondsApart < secondsThreshold && machine && machine.machine_id !== undefined) {
      localStorage.setItem('machine_id', machine.machine_id.toString());
      router.push('/Home');
    }
  };

  return (
    <div className="Machine">
      <h1>Machine Page</h1>  
      <Link href="/">{"<-Back"}</Link>

      {(secondsApart < secondsThreshold) && machine && (
        <button className="machine_box" onClick={handleMachineSelect}>
          <h2>{machine.machine_name}</h2>
          <p>Network: {machine.machine_network}</p>
          <p>Location: {machine.machine_street}, {machine.machine_city}, {machine.machine_state} {machine.machine_zip_code}</p>
          <p>Temperature: {machine.machine_temperature} °C</p>
          <p>Battery: {machine.machine_batter ? 'Good' : 'Low'}</p>
          <p>Status: {secondsApart < secondsThreshold ? "ON" : "OFF"}</p>
        </button>
      )}
      {(secondsApart >= secondsThreshold) && (
        <p>No machines available</p>
      )}
      {secondsApart}
    </div>
  );
}
