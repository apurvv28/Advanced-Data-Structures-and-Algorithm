"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { Node3D } from "./Node3D";
import { Edge3D } from "./Edge3D";
import { useEffect, Suspense } from "react";

export function Engine3D() {
  const { currentStepIndex, steps, isPlaying, nextStep, playbackSpeed } =
    useVisualizerStore();
  const currentStep = steps[currentStepIndex];

  // Auto-playback
  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      timeoutId = setTimeout(() => nextStep(), playbackSpeed);
    }
    return () => clearTimeout(timeoutId);
  }, [isPlaying, currentStepIndex, steps.length, nextStep, playbackSpeed]);

  if (!currentStep) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background">
        <div className="border-brutal p-6 bg-primary shadow-brutal-sm">
          <span className="text-base font-black uppercase tracking-wider">
            Waiting for data...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "#FFFEF0" }}
      >
        <Suspense fallback={null}>
          {/* Flat lighting — no soft shadows */}
          <ambientLight intensity={1.2} />
          <directionalLight position={[5, 10, 5]} intensity={0.8} />

          {/* Grid floor */}
          <group position={[0, -8, -1]}>
            <gridHelper
              args={[40, 20, "#000000", "#E0E0D0"]}
              rotation={[Math.PI / 2, 0, 0]}
            />
          </group>

          {/* Edges */}
          {currentStep.edges.map((edge, i) => (
            <Edge3D
              key={`e-${edge.from}-${edge.to}-${i}`}
              edge={edge}
              nodes={currentStep.nodes}
            />
          ))}

          {/* Nodes */}
          {currentStep.nodes.map((node) => (
            <Node3D key={`n-${node.id}`} node={node} />
          ))}

          <OrbitControls
            enableRotate={false}
            enablePan
            enableZoom
            minDistance={5}
            maxDistance={30}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
