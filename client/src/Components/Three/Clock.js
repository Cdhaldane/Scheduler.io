import React, { useRef, useEffect, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

function ClockHand({ length, width, rotation }) {
  return (
    <mesh rotation={rotation}>
      <boxGeometry args={[width, length, 0.1]} />
      <meshBasicMaterial color="black" />
    </mesh>
  );
}

function AnalogClock() {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const hoursRotation =
    (time.getHours() % 12) * (Math.PI / 6) +
    (Math.PI / 360) * time.getMinutes();
  const minutesRotation = time.getMinutes() * (Math.PI / 30);
  const secondsRotation = time.getSeconds() * (Math.PI / 30);

  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      {/* Hour hand */}
      <ClockHand length={2} width={0.1} rotation={[0, 0, -hoursRotation]} />

      {/* Minute hand */}
      <ClockHand length={3} width={0.05} rotation={[0, 0, -minutesRotation]} />

      {/* Second hand */}
      <ClockHand
        length={3.5}
        width={0.02}
        rotation={[0, 0, -secondsRotation]}
      />

      {/* Clock face */}
      <mesh>
        <circleGeometry args={[4, 64]} />
        <meshBasicMaterial color="white" />
      </mesh>

      {/* Clock border */}
      <mesh>
        <ringGeometry args={[4.05, 4.5, 64]} />
        <meshBasicMaterial color="black" />
      </mesh>
    </Canvas>
  );
}

export default AnalogClock;
