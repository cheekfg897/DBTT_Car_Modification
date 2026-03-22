import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import { useStore } from '../../store/useStore';
import { getFinish } from '../../utils/dataLookup';
import { FINISH_PRESETS } from '../../data/modCatalog';

const LIGHT_GLASS_MESHES = new Set(['Plane010_balck_tint_glass_0', 'Plane035_balck_tint_glass_0']);
const RIM_MESHES = new Set(['Plane016_metal_0', 'Plane018_metal_0', 'Plane020_metal_0', 'Plane074_metal_0']);

export function CarModel() {
  const { scene } = useGLTF('/models/toyota_supra.glb');
  const customization = useStore((s) => s.customization);

  const { clonedScene, materialMap } = useMemo(() => {
    const clone = scene.clone(true);
    const map = new Map<string, MeshStandardMaterial[]>();

    clone.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material = child.material.clone();
        const matName = child.material.name;
        // Separate headlight/taillight glass from window glass
        if (matName === 'balck_tint_glass' && LIGHT_GLASS_MESHES.has(child.name)) {
          if (!map.has('glass_light')) map.set('glass_light', []);
          map.get('glass_light')!.push(child.material);
        } else if (matName === 'metal' && RIM_MESHES.has(child.name)) {
          if (!map.has('rim')) map.set('rim', []);
          map.get('rim')!.push(child.material);
        } else {
          if (!map.has(matName)) map.set(matName, []);
          map.get(matName)!.push(child.material);
        }
      }
    });

    return { clonedScene: clone, materialMap: map };
  }, [scene]);

  useEffect(() => {
    const finish = getFinish(customization.finishType) || FINISH_PRESETS[0];

    // Body color + finish
    materialMap.get('carpaint')?.forEach((m) => {
      m.color.set(customization.bodyColor);
      m.roughness = finish.roughness;
      m.metalness = finish.metalness;
    });

    // Window tint (windows only — not headlights/taillights)
    materialMap.get('balck_tint_glass')?.forEach((m) => {
      m.transparent = true;
      m.opacity = customization.windowTint;
      m.depthWrite = false;
    });

    // Headlight/taillight glass — always fully transparent
    materialMap.get('glass_light')?.forEach((m) => {
      m.transparent = true;
      m.opacity = 0;
      m.depthWrite = false;
    });

    // Rim color (wheel metal only)
    materialMap.get('rim')?.forEach((m) => {
      m.color.set(customization.rimColor);
    });

    // Brake caliper color
    materialMap.get('brake')?.forEach((m) => {
      m.color.set(customization.caliperColor);
    });
  }, [customization, materialMap]);

  return <primitive object={clonedScene} scale={1} position={[0, -0.5, 0]} />;
}


useGLTF.preload('/models/toyota_supra.glb');
