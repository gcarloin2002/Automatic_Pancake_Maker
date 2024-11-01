import Link from 'next/link';
import Image from 'next/image';
import logo from '../assets/logo.png';

// Import collage images from assets
import collage1 from '../assets/placeholder.png';
import collage2 from '../assets/placeholder.png';
import collage3 from '../assets/placeholder.png';
import collage4 from '../assets/placeholder.png';
import collage5 from '../assets/placeholder.png';
import collage6 from '../assets/placeholder.png';
import collage7 from '../assets/placeholder.png';
import collage8 from '../assets/placeholder.png';

import '../styles/Welcome.css';

// Array of images with src and alt (width/height removed)
const collage_images = [
  { src: collage1, alt: 'Collage Image 1' },
  { src: collage2, alt: 'Collage Image 2' },
  { src: collage3, alt: 'Collage Image 3' },
  { src: collage4, alt: 'Collage Image 4' },
  { src: collage5, alt: 'Collage Image 5' },
  { src: collage6, alt: 'Collage Image 6' },
  { src: collage7, alt: 'Collage Image 7' },
  { src: collage8, alt: 'Collage Image 8' },
];

export default function Home() {
  return (
    <>
      <div className="welcome-top-bar">
        <Link className="welcome-login-button" href="/Login">Login</Link>
      </div>
      <div className="title-card">
        <div className="logo-container">
          <Image src={logo} alt="Logo" layout="responsive" objectFit="contain" />
        </div>
        <h1 className="title">Automatic Pancake Maker</h1>
      </div>
      <div className="barrier"></div>
      
      {/* Collage of images */}
      <div className="collage">
        {collage_images.map((image, index) => (
          <div key={index} className="collage-image-container">
            <Image
              src={image.src}
              alt={image.alt}
              layout="responsive"
              objectFit="contain"
            />
          </div>
        ))}
      </div>
    </>
  );
}
