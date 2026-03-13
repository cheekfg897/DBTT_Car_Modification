import { useEffect, useMemo } from 'react';
import { useGLTF } from '@react-three/drei';
import { Mesh, MeshStandardMaterial } from 'three';
import { useStore } from '../../store/useStore';
import { getFinish } from '../../utils/dataLookup';
import { FINISH_PRESETS } from '../../data/modCatalog';

export function CarModel() {
  const { scene } = useGLTF('/models/toyota_supra.glb');
  const customization = useStore((s) => s.customization);

  const { clonedScene, materialMap } = useMemo(() => {
    const clone = scene.clone(true);
    const map = new Map<string, MeshStandardMaterial[]>();

    clone.traverse((child) => {
      if (child instanceof Mesh && child.material instanceof MeshStandardMaterial) {
        child.material = child.material.clone();
        const name = child.material.name;
        if (name === 'metal') {
          const groupKey = isWheelMesh(child) ? 'metal_wheel' : 'metal_other';
          if (!map.has(groupKey)) map.set(groupKey, []);
          map.get(groupKey)!.push(child.material);
        } else {
          if (!map.has(name)) map.set(name, []);
          map.get(name)!.push(child.material);
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

    // Window tint
    materialMap.get('balck_tint_glass')?.forEach((m) => {
      m.transparent = true;
      m.opacity = 1.0 - customization.windowTint;
      m.depthWrite = false;
    });

    // Rim color (wheel assemblies)
    materialMap.get('metal_wheel')?.forEach((m) => {
      m.color.set(customization.rimColor);
    });

    // Brake caliper color
    materialMap.get('brake')?.forEach((m) => {
      m.color.set(customization.caliperColor);
    });
  }, [customization, materialMap]);

  return <primitive object={clonedScene} scale={1} position={[0, -0.5, 0]} />;
}

function isWheelMesh(mesh: Mesh): boolean {
  // Walk up the tree to check if this mesh is part of a wheel assembly
  let node = mesh.parent;
  while (node) {
    const name = node.name.toLowerCase();
    if (name.includes('wheel') || name.includes('tire') || name.includes('rim')) {
      return true;
    }
    node = node.parent;
  }
  // Fallback: check mesh name
  const meshName = mesh.name.toLowerCase();
  return meshName.includes('wheel') || meshName.includes('rim');
}

useGLTF.preload('/models/toyota_supra.glb');
