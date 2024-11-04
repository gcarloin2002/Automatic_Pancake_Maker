"use client";

import Image from 'next/image';
import LogoutButton from '@/components/LogoutButton';
import { useRouter } from 'next/navigation';
import '../../styles/Home.css';
import order_icon from '../../assets/order-icon.png';
import queue_icon from '../../assets/queue-icon.png';
import diagnostics_icon from '../../assets/diagnostics-icon.png';

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
        <h1>Welcome User!</h1>
        <div></div>
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
              <Image src={queue_icon} alt="Logo" width='250' />
            </div>
            <h1 className="home-button-label"> Queue</h1>
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