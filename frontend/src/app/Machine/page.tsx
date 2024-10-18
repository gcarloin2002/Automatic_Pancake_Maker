"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation'; // Import useRouter
import "../../styles/Machine.css";
import { useState, useEffect } from 'react';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine'; // Adjust this import based on your actual file structure

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
  const [machine, setMachine] = useState<Machine | null>(null); // Initialize machine state
  const [secondsApart, setSecondsApart] = useState<number>(0); // New state for seconds apart
  const router = useRouter(); // Initialize useRouter

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

          // Calculate seconds apart using the machine's timestamp
          const seconds = Math.abs(calculateSecondsApart(formattedTimestamp) + 18000);
          setSecondsApart(seconds); // Store the result in state
        }
      } catch (error) {
        console.error('Error fetching machine data:', error);
      }
    };

    // Fetch the machine data initially
    fetchMachineData();

    // Set up an interval to fetch the machine data every second
    const intervalId = setInterval(fetchMachineData, 1000);

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // Dependency array includes machine_id

  // Function to handle button click
  const handleButtonClick = () => {
    if (secondsApart < 5) {
      router.push('/Home'); // Navigate to /Home if secondsApart is less than 5
    }
  };

  return (
    <div className="Machine">
      <h1>Machine Page</h1>  
      <Link href="/">{"<-Back"}</Link>

      {(secondsApart < 5) && machine && (
        <button className="machine_box" onClick={handleButtonClick}>
          <h2>{machine.machine_name}</h2>
          <p>Network: {machine.machine_network}</p>
          <p>Location: {machine.machine_street}, {machine.machine_city}, {machine.machine_state} {machine.machine_zip_code}</p>
          <p>Temperature: {machine.machine_temperature} °C</p>
          <p>Battery: {machine.machine_batter ? 'Good' : 'Low'}</p>
          <p>Status: {secondsApart < 5 ? "ON" : "OFF"}</p> {/* Display status based on seconds apart */}
        </button>
      )}
      {(secondsApart >= 5) && (
        <p>No machines available</p>
      )}
    </div>
  );
}
