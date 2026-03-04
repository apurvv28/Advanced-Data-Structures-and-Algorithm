"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Engine3D } from "@/components/visualizer/Engine3D";
import { CodePane } from "@/components/visualizer/CodePane";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { AVLSimulator } from "@/lib/algorithms/avl";

const AVL_CODE = [
  "Node* insert(Node* node, int key) {",
  "  if (node == NULL)",
  "    return newNode(key);",
  "",
  "  if (key < node->key)",
  "    node->left = insert(node->left, key);",
  "  else if (key > node->key)",
  "    node->right = insert(node->right, key);",
  "  else return node;",
  "",
  "  node->height = 1 + max(height(L), height(R));",
  "  int balance = getBalance(node);",
  "",
  "  // Left-Left → Right Rotate",
  "  if (balance > 1 && key < node->left->key)",
  "    return rightRotate(node);",
  "",
  "  // Right-Right → Left Rotate",
  "  if (balance < -1 && key > node->right->key)",
  "    return leftRotate(node);",
  "",
  "  // Left-Right → Double Rotate",
  "  if (balance > 1 && key > node->left->key) {",
  "    node->left = leftRotate(node->left);",
  "    return rightRotate(node);",
  "  }",
  "",
  "  // Right-Left → Double Rotate",
  "  if (balance < -1 && key < node->right->key) {",
  "    node->right = rightRotate(node->right);",
  "    return leftRotate(node);",
  "  }",
  "",
  "  return node;",
  "}",
];

const PRESETS = [
  { label: "LL Case", values: [30, 20, 10] },
  { label: "RR Case", values: [10, 20, 30] },
  { label: "LR Case", values: [30, 10, 20] },
  { label: "RL Case", values: [10, 30, 20] },
  { label: "Mixed", values: [10, 20, 30, 40, 50, 25] },
];

interface AVLVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AVLVisualizer({ isOpen, onClose }: AVLVisualizerProps) {
  const { setSteps, reset } = useVisualizerStore();
  const [inputValue, setInputValue] = useState("10, 20, 30, 40, 50, 25");
  const [isVisualizing, setIsVisualizing] = useState(false);

  const runSimulation = useCallback(
    (values: number[]) => {
      const sim = new AVLSimulator();
      sim.insertSequence(values);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const handleVisualize = () => {
    const values = inputValue
      .split(",")
      .map((v) => parseInt(v.trim()))
      .filter((v) => !isNaN(v));
    if (values.length > 0) runSimulation(values);
  };

  const handlePreset = (values: number[]) => {
    setInputValue(values.join(", "));
    runSimulation(values);
  };

  const handleClose = () => {
    setIsVisualizing(false);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  // ── State 2: Full visualization ──
  if (isVisualizing && isOpen) {
    return (
      <Modal
        isOpen
        onClose={handleClose}
        title="AVL TREE"
        VisualizerComponent={<Engine3D />}
        CodeComponent={<CodePane code={AVL_CODE} />}
      />
    );
  }

  // ── State 1: Input dialog ──
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-lg border-brutal bg-background shadow-brutal-xl"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b-brutal bg-primary">
              <h2 className="text-2xl font-black uppercase tracking-wider">
                AVL Tree
              </h2>
              <p className="text-sm font-bold mt-1">
                Enter values to visualize insertions &amp; rotations
              </p>
            </div>

            <div className="p-6 space-y-5">
              {/* Input */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  Values (comma-separated)
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleVisualize()}
                  className="w-full border-brutal px-4 py-3 text-lg font-mono font-bold bg-white shadow-brutal-sm focus:outline-none focus:shadow-brutal transition-all"
                  placeholder="10, 20, 30, 40, 50"
                />
              </div>

              {/* Presets */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => handlePreset(p.values)}
                      className="px-3 py-2 text-xs font-black uppercase border-brutal bg-white hover:bg-primary shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleVisualize}
                  className="flex-1 py-3 text-base font-black uppercase border-brutal bg-accent-green text-black shadow-brutal hover:shadow-brutal-lg active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  ▶ VISUALIZE
                </button>
                <button
                  onClick={handleClose}
                  className="px-6 py-3 text-base font-black uppercase border-brutal bg-secondary text-white shadow-brutal active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                >
                  CANCEL
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
