import { Canvas } from "@react-three/fiber";
import { OrbitControls, Bounds } from "@react-three/drei";
import Model from "../../public/models/Model";

export default function ModelComponent() {
  return (
      <Canvas
        style={{ width: "35rem", height: "35rem" }}
      >
        <ambientLight intensity={1} />
        <directionalLight position={[3,3,3]} />
        <Bounds fit clip observe margin={1.2}>
          <Model />
        </Bounds>
        <OrbitControls enableZoom={false} />
      </Canvas>
  );
}
