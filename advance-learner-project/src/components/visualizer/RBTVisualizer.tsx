"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Engine3D } from "@/components/visualizer/Engine3D";
import { CodePane } from "@/components/visualizer/CodePane";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { RBTSimulator } from "@/lib/algorithms/rbt";

const RBT_CODE = [
  "Node* insert(Node* root, int key) {",
  "  // BST insert, color new node RED",
  "  Node* z = new Node(key, RED);",
  "  bstInsert(root, z);",
  "  insertFixup(root, z);",
  "}",
  "",
  "void insertFixup(Node* &root, Node* z) {",
  "  while (z->parent->color == RED) {",
  "    // Case 1: Uncle is RED → recolor",
  "    if (uncle->color == RED) {",
  "      parent->color = BLACK;",
  "      uncle->color = BLACK;",
  "      grandparent->color = RED;",
  "      z = grandparent;",
  "    } else {",
  "      // Case 2: z is inner child → rotate to outer",
  "      if (z == parent->right) {",
  "        z = parent;",
  "        leftRotate(root, z);",
  "      }",
  "      // Case 3: z is outer child → recolor + rotate",
  "      parent->color = BLACK;",
  "      grandparent->color = RED;",
  "      rightRotate(root, grandparent);",
  "    }",
  "  }",
  "  root->color = BLACK;",
  "}",
  "",
  "// ── DELETE ──",
  "void deleteNode(Node* &root, int key) {",
  "  Node* z = search(root, key);",
  "  // Find replacement, transplant",
  "  if (originalColor == BLACK)",
  "    deleteFixup(root, x);",
  "}",
];

const PRESETS_INSERT = [
  { label: "Simple 3", values: [10, 20, 30] },
  { label: "Recolor", values: [10, 20, 30, 15] },
  { label: "Double Rot", values: [50, 40, 60, 20, 45, 10, 25] },
  { label: "Full", values: [7, 3, 18, 10, 22, 8, 11, 26, 2, 6, 13] },
];

const PRESETS_DELETE = [
  {
    label: "Delete leaf",
    insert: [10, 5, 15, 3, 7],
    delete: [3],
  },
  {
    label: "Delete root",
    insert: [10, 5, 15, 3, 7],
    delete: [10],
  },
  {
    label: "Multi delete",
    insert: [7, 3, 18, 10, 22, 8, 11, 26],
    delete: [18, 11, 3],
  },
];

interface RBTVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function RBTVisualizer({ isOpen, onClose }: RBTVisualizerProps) {
  const { setSteps, reset } = useVisualizerStore();
  const [inputValue, setInputValue] = useState("7, 3, 18, 10, 22, 8, 11, 26");
  const [deleteValue, setDeleteValue] = useState("18, 11");
  const [mode, setMode] = useState<"insert" | "delete">("insert");
  const [isVisualizing, setIsVisualizing] = useState(false);

  const runInsert = useCallback(
    (values: number[]) => {
      const sim = new RBTSimulator();
      sim.insertSequence(values);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const runDelete = useCallback(
    (insertVals: number[], deleteVals: number[]) => {
      const sim = new RBTSimulator();
      sim.deleteSequence(insertVals, deleteVals);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const handleVisualize = () => {
    const ins = inputValue.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
    if (mode === "insert") {
      if (ins.length > 0) runInsert(ins);
    } else {
      const del = deleteValue.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
      if (ins.length > 0 && del.length > 0) runDelete(ins, del);
    }
  };

  const handleClose = () => {
    setIsVisualizing(false);
    reset();
    onClose();
  };

  useEffect(() => {
    if (!isOpen) reset();
  }, [isOpen, reset]);

  if (isVisualizing && isOpen) {
    return (
      <Modal
        isOpen
        onClose={handleClose}
        title="RED-BLACK TREE"
        VisualizerComponent={<Engine3D />}
        CodeComponent={<CodePane code={RBT_CODE} />}
      />
    );
  }

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
            <div className="px-6 py-4 border-b-brutal bg-secondary text-white">
              <h2 className="text-2xl font-black uppercase tracking-wider">
                Red-Black Tree
              </h2>
              <p className="text-sm font-bold mt-1">Insertion &amp; Deletion with rotations &amp; recoloring</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Mode toggle */}
              <div className="flex gap-2">
                {(["insert", "delete"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-black uppercase border-brutal transition-all ${
                      mode === m ? "bg-secondary text-white shadow-brutal-sm" : "bg-white hover:bg-surface-alt"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Insert values */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  {mode === "insert" ? "Values to Insert" : "Build tree first"}
                </label>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full border-brutal px-4 py-3 text-lg font-mono font-bold bg-white shadow-brutal-sm focus:outline-none focus:shadow-brutal transition-all"
                />
              </div>

              {/* Delete values */}
              {mode === "delete" && (
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider mb-2">
                    Values to Delete
                  </label>
                  <input
                    type="text"
                    value={deleteValue}
                    onChange={(e) => setDeleteValue(e.target.value)}
                    className="w-full border-brutal px-4 py-3 text-lg font-mono font-bold bg-white shadow-brutal-sm focus:outline-none focus:shadow-brutal transition-all"
                  />
                </div>
              )}

              {/* Presets */}
              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">
                  Quick Presets
                </label>
                <div className="flex flex-wrap gap-2">
                  {mode === "insert"
                    ? PRESETS_INSERT.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            setInputValue(p.values.join(", "));
                            runInsert(p.values);
                          }}
                          className="px-3 py-2 text-xs font-black uppercase border-brutal bg-white hover:bg-secondary hover:text-white shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                        >
                          {p.label}
                        </button>
                      ))
                    : PRESETS_DELETE.map((p) => (
                        <button
                          key={p.label}
                          onClick={() => {
                            setInputValue(p.insert.join(", "));
                            setDeleteValue(p.delete.join(", "));
                            runDelete(p.insert, p.delete);
                          }}
                          className="px-3 py-2 text-xs font-black uppercase border-brutal bg-white hover:bg-secondary hover:text-white shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
