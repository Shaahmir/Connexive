import { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";

export default function Model() {
  const { scene } = useGLTF("/models/enderman.glb");
  const modelRef = useRef();

  useFrame(() => {
    if (modelRef.current) {
      modelRef.current.rotation.y += 0.01;
    }
  });

  return (
    <group ref={modelRef} rotation={[0.2, 0, 0]}>
      <primitive object={scene} />
    </group>
  );
}
