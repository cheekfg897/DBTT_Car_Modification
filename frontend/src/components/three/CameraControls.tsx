import { OrbitControls } from '@react-three/drei';

interface CameraControlsProps {
  autoRotate: boolean;
}

export function CameraControls({ autoRotate }: CameraControlsProps) {
  return (
    <OrbitControls
      autoRotate={autoRotate}
      autoRotateSpeed={1.5}
      minDistance={3}
      maxDistance={10}
      minPolarAngle={0.3}
      maxPolarAngle={Math.PI / 2.1}
      enablePan={true}
      enableDamping={true}
      dampingFactor={0.05}
    />
  );
}
