"use client";

import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import '../../styles/Home.css';

export default function HomePage() {

  const router = useRouter();



  const order_click = () => {
    router.push('/Order');  // Redirect to Registration page
  };

  const queue_click = () => {
    router.push('/Queue');  // Redirect to Registration page
  };

  const diagnostics_click = () => {
    router.push('/Diagnostics');  // Redirect to Registration page
  };


  return (
    <>
      <div className="home-top-bar-gap"></div>
      <div className="home-top-bar">
        <LogoutButton />
      </div>

      <div className="home-buttons-container">

        <div className="home-buttons">
          <button className="home-button home-button-1" onClick={order_click}>
            <h1 className="home-button-label">
              Order
            </h1>
          </button>
          <button className="home-button home-button-2" onClick={queue_click}>
            <h1 className="home-button-label">
              Queue
            </h1>
          </button>
          <button className="home-button home-button-3" onClick={diagnostics_click}>
            <h1 className="home-button-label">
              Diagnostics
            </h1>
          </button>

        </div>



      </div>



    </>
  );
}