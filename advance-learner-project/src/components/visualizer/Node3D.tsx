import { useSpring, animated } from "@react-spring/three";
import { Html } from "@react-three/drei";
import { NodeState } from "@/store/useVisualizerStore";

interface Node3DProps {
  node: NodeState;
}

const COLORS: Record<NodeState["state"], string> = {
  default: "#FFE500",
  highlighted: "#4D9FFF",
  swapping: "#FF6B9D",
  inserted: "#00CC66",
  rotating: "#FF6B6B",
};

export function Node3D({ node }: Node3DProps) {
  const isActive = node.state !== "default";
  const rbColor = node.meta?.rbColor;

  const { position, color, scale } = useSpring({
    position: [node.x, node.y, 0] as [number, number, number],
    color: COLORS[node.state] || COLORS.default,
    scale: isActive
      ? ([1.15, 1.15, 1.15] as [number, number, number])
      : ([1, 1, 1] as [number, number, number]),
    config: { mass: 1, tension: 170, friction: 20 },
  });

  return (
    <animated.group position={position as unknown as [number, number, number]} scale={scale as unknown as [number, number, number]}>
      {/* Black border box (slightly larger) */}
      <mesh position={[0, 0, -0.02]}>
        <boxGeometry args={[1.45, 1.45, 0.32]} />
        <meshBasicMaterial color="#000000" />
      </mesh>

      {/* Colored face */}
      <mesh position={[0, 0, 0.04]}>
        <boxGeometry args={[1.2, 1.2, 0.26]} />
        <animated.meshStandardMaterial
          color={color}
          roughness={1}
          metalness={0}
        />
      </mesh>

      {/* RB color indicator dot + label (top-right corner) */}
      {rbColor && (
        <mesh position={[0.55, 0.55, 0.2]}>
          <sphereGeometry args={[0.22, 16, 16]} />
          <meshBasicMaterial color={rbColor === "RED" ? "#FF0000" : "#111111"} />
        </mesh>
      )}

      {/* Value label */}
      <Html center position={[0, 0, 0.3]} style={{ pointerEvents: "none" }}>
        <div
          style={{
            fontFamily: "'Inter', system-ui, sans-serif",
            fontWeight: 900,
            fontSize: "18px",
            color: "#000000",
            userSelect: "none",
            position: "relative",
          }}
        >
          {node.value}
          {/* RB color text badge */}
          {rbColor && (
            <span
              style={{
                position: "absolute",
                top: "-16px",
                right: "-18px",
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 900,
                fontSize: "11px",
                color: rbColor === "RED" ? "#FF0000" : "#000000",
                backgroundColor: rbColor === "RED" ? "#FFD0D0" : "#D0D0D0",
                border: `2px solid ${rbColor === "RED" ? "#FF0000" : "#000000"}`,
                borderRadius: "0px",
                padding: "1px 3px",
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {rbColor === "RED" ? "R" : "B"}
            </span>
          )}
        </div>
      </Html>
    </animated.group>
  );
}
