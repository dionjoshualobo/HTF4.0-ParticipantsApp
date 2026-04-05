import React, { useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import MarqueeGrid from './components/MarqueeGrid';
import LoginForm from './components/LoginForm';

const Scene = () => {
  const progressRef = useRef(0);
  return (
    <>
      <MarqueeGrid scrollProgressRef={progressRef} />
    </>
  );
};

function App() {

  return (
    <>
      {/* Static Background Image Layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-[-3]"
        style={{
          backgroundImage: "url('/background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundColor: '#0e0e0b'
        }}
      ></div>

      {/* Blur Overlay for Static Background Only */}
      <div className="fixed inset-0 backdrop-blur-lg bg-black/30 pointer-events-none z-[-2]"></div>


      {/* Comic Book Texture Overlays */}
      <div className="fixed inset-0 paper-grain pointer-events-none z-0"></div>
      <div className="fixed inset-0 halftone-bg pointer-events-none z-0"></div>

      {/* Content Rendering based on State */}
      <LoginForm onLogin={() => console.log('Login clicked')} />

    </>
  );
}

export default App;
