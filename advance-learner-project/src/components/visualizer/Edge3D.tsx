import { useSpring, animated } from "@react-spring/three";
import { EdgeState, NodeState } from "@/store/useVisualizerStore";

interface Edge3DProps {
  edge: EdgeState;
  nodes: NodeState[];
}

export function Edge3D({ edge, nodes }: Edge3DProps) {
  const fromNode = nodes.find((n) => n.id === edge.from);
  const toNode = nodes.find((n) => n.id === edge.to);

  const dx = (toNode?.x ?? 0) - (fromNode?.x ?? 0);
  const dy = (toNode?.y ?? 0) - (fromNode?.y ?? 0);
  const length = Math.sqrt(dx * dx + dy * dy);

  const midX = ((fromNode?.x ?? 0) + (toNode?.x ?? 0)) / 2;
  const midY = ((fromNode?.y ?? 0) + (toNode?.y ?? 0)) / 2;
  const angle = Math.atan2(dy, dx);

  const { position, rotation, scaleY } = useSpring({
    position: [midX, midY, -0.3] as [number, number, number],
    rotation: [0, 0, angle - Math.PI / 2] as [number, number, number],
    scaleY: length,
    config: { mass: 1, tension: 170, friction: 20 },
  });

  if (!fromNode || !toNode) return null;

  return (
    <animated.mesh
      position={position as unknown as [number, number, number]}
      rotation={rotation as unknown as [number, number, number]}
      scale-y={scaleY}
    >
      <cylinderGeometry args={[0.08, 0.08, 1, 8]} />
      <meshBasicMaterial color="#000000" />
    </animated.mesh>
  );
}
