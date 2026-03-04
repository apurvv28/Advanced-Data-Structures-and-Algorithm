"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Engine3D } from "@/components/visualizer/Engine3D";
import { CodePane } from "@/components/visualizer/CodePane";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { BTreeSimulator } from "@/lib/algorithms/btree";

const BTREE_CODE = [
  "void insert(BTree &T, int k) {",
  "  if (root is full) {",
  "    split root, create new root;",
  "  }",
  "  insertNonFull(root, k);",
  "}",
  "",
  "void insertNonFull(Node* x, int k) {",
  "  if (x is leaf) {",
  "    insert k in sorted position;",
  "  } else {",
  "    find child ci;",
  "    if (ci is full) splitChild(x, i);",
  "    insertNonFull(ci, k);",
  "  }",
  "}",
  "",
  "void delete(Node* x, int k) {",
  "  if (k in x and x is leaf)",
  "    remove k;",
  "  else if (k in x) {",
  "    replace with pred/succ or merge;",
  "  } else {",
  "    ensure child has >= t keys;",
  "    recurse into child;",
  "  }",
  "}",
  "",
  "void splitChild(Node* x, int i) {",
  "  median key moves up;",
  "  left half stays, right half → new node;",
  "}",
];

const PRESETS_INSERT = [
  { label: "Small", values: [10, 20, 5, 6, 12, 30], order: 3 },
  { label: "Medium", values: [3, 7, 1, 14, 8, 5, 11, 17, 13, 6, 23, 12, 20, 26, 4, 16], order: 3 },
  { label: "Order 4", values: [10, 20, 30, 40, 50, 25, 35, 5, 15], order: 4 },
];

const PRESETS_DELETE = [
  { label: "Del leaf", insert: [10, 20, 5, 6, 12, 30, 7, 17], delete: [6, 7], order: 3 },
  { label: "Del internal", insert: [10, 20, 5, 6, 12, 30, 7, 17], delete: [10], order: 3 },
  { label: "Multi del", insert: [3, 7, 1, 14, 8, 5, 11, 17, 13], delete: [13, 7, 11], order: 3 },
];

interface BTreeVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BTreeVisualizer({ isOpen, onClose }: BTreeVisualizerProps) {
  const { setSteps, reset } = useVisualizerStore();
  const [inputValue, setInputValue] = useState("10, 20, 5, 6, 12, 30, 7, 17");
  const [deleteValue, setDeleteValue] = useState("6, 7");
  const [order, setOrder] = useState(3);
  const [mode, setMode] = useState<"insert" | "delete">("insert");
  const [isVisualizing, setIsVisualizing] = useState(false);

  const runInsert = useCallback(
    (values: number[], t: number) => {
      const sim = new BTreeSimulator(t);
      sim.insertSequence(values);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const runDelete = useCallback(
    (insertVals: number[], deleteVals: number[], t: number) => {
      const sim = new BTreeSimulator(t);
      sim.deleteSequence(insertVals, deleteVals);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const handleVisualize = () => {
    const ins = inputValue.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
    if (mode === "insert") {
      if (ins.length > 0) runInsert(ins, order);
    } else {
      const del = deleteValue.split(",").map((v) => parseInt(v.trim())).filter((v) => !isNaN(v));
      if (ins.length > 0 && del.length > 0) runDelete(ins, del, order);
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
        title="B-TREE"
        VisualizerComponent={<Engine3D />}
        CodeComponent={<CodePane code={BTREE_CODE} />}
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
            <div className="px-6 py-4 border-b-brutal bg-accent-orange">
              <h2 className="text-2xl font-black uppercase tracking-wider">
                B-Tree
              </h2>
              <p className="text-sm font-bold mt-1">Insertion &amp; Deletion with splits &amp; merges</p>
            </div>

            <div className="p-6 space-y-5">
              {/* Mode + Order */}
              <div className="flex gap-2">
                {(["insert", "delete"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-black uppercase border-brutal transition-all ${
                      mode === m ? "bg-accent-orange shadow-brutal-sm" : "bg-white hover:bg-surface-alt"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              {/* Order selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">Min Degree (t):</span>
                {[2, 3, 4].map((t) => (
                  <button
                    key={t}
                    onClick={() => setOrder(t)}
                    className={`px-3 py-1 text-sm font-black border-brutal-thin transition-all ${
                      order === t ? "bg-accent-orange shadow-brutal-sm" : "bg-white"
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>

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

              <div>
                <label className="block text-xs font-black uppercase tracking-wider mb-2">Quick Presets</label>
                <div className="flex flex-wrap gap-2">
                  {(mode === "insert" ? PRESETS_INSERT : PRESETS_DELETE).map((p) => (
                    <button
                      key={p.label}
                      onClick={() => {
                        if ("values" in p) {
                          setInputValue(p.values.join(", "));
                          setOrder(p.order);
                          runInsert(p.values, p.order);
                        } else {
                          setInputValue(p.insert.join(", "));
                          setDeleteValue(p.delete.join(", "));
                          setOrder(p.order);
                          runDelete(p.insert, p.delete, p.order);
                        }
                      }}
                      className="px-3 py-2 text-xs font-black uppercase border-brutal bg-white hover:bg-accent-orange shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

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
