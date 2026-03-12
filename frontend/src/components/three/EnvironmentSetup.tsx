import { Environment, ContactShadows } from '@react-three/drei';

export function EnvironmentSetup() {
  return (
    <>
      <Environment preset="city" />
      <ContactShadows
        position={[0, -0.5, 0]}
        opacity={0.5}
        scale={20}
        blur={2}
        far={4}
      />
      <ambientLight intensity={0.3} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
    </>
  );
}
