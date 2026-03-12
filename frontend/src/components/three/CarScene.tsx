import { Suspense, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Html, useProgress } from '@react-three/drei';
import { CarModel } from './CarModel';
import { CameraControls } from './CameraControls';
import { EnvironmentSetup } from './EnvironmentSetup';
import { RotateCw } from 'lucide-react';

function Loader() {
  const { progress } = useProgress();
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3">
        <div className="w-48 h-2 bg-zinc-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-orange-accent rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-zinc-400 text-sm">Loading model... {progress.toFixed(0)}%</p>
      </div>
    </Html>
  );
}

export function CarScene() {
  const [autoRotate, setAutoRotate] = useState(false);

  return (
    <div className="relative w-full h-full">
      <Canvas
        camera={{ position: [4, 2, 5], fov: 45 }}
        gl={{ antialias: true, alpha: false }}
        className="bg-zinc-950"
      >
        <color attach="background" args={['#09090b']} />
        <Suspense fallback={<Loader />}>
          <CarModel />
          <EnvironmentSetup />
        </Suspense>
        <CameraControls autoRotate={autoRotate} />
      </Canvas>

      <button
        onClick={() => setAutoRotate(!autoRotate)}
        className={`absolute bottom-4 right-4 p-2 rounded-lg transition-colors cursor-pointer ${
          autoRotate ? 'bg-orange-accent text-white' : 'bg-zinc-800 text-zinc-400 hover:text-white'
        }`}
        title="Toggle auto-rotate"
      >
        <RotateCw className="w-5 h-5" />
      </button>
    </div>
  );
}
