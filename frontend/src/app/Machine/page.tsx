"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import "../../styles/Machine.css";
import { useState, useEffect } from 'react';
import { getMachineById, convertToDatabaseFormat, calculateSecondsApart } from '@/pages/api/machine';


const refreshRate = 5000
const secondsThreshold = 10
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
  machine_batter: number;
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

    const intervalId = setInterval(fetchMachineData, refreshRate);

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
    <>
      <div className="machine-top-bar">
        <Link className="return-button" href="/">{"< Return"}</Link>
      </div>
      <div className="machine-container">
        <h1 className="machine-title">Machines</h1>  
        {(secondsApart < secondsThreshold) && machine && (
          <button className="machine_box" onClick={handleMachineSelect}>
            <h1 className="machine-name">{machine.machine_name}</h1>
            <p className="machine-status">Network: {machine.machine_network}</p>
            <p className="machine-status">Location: {machine.machine_street}, {machine.machine_city}, {machine.machine_state} {machine.machine_zip_code}</p>
            <p className="machine-status">Temperature: {machine.machine_temperature} °C</p>
            <p className="machine-status">Batter: {machine.machine_batter}</p>
            <p className="machine-status">Status: {secondsApart < secondsThreshold ? "ON" : "OFF"}</p>
          </button>
        )}
        {(secondsApart >= secondsThreshold) && (
          <p className="no-machines">(No machines available)</p>
        )}
      </div>
      
    </>
  );
}