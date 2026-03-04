"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Modal } from "@/components/ui/Modal";
import { Engine3D } from "@/components/visualizer/Engine3D";
import { CodePane } from "@/components/visualizer/CodePane";
import { useVisualizerStore } from "@/store/useVisualizerStore";
import { BPlusTreeSimulator } from "@/lib/algorithms/bplustree";

const BPLUS_CODE = [
  "void insert(B+Tree &T, int k) {",
  "  result = insertRec(root, k);",
  "  if (result) {",
  "    create new root with separator;",
  "  }",
  "}",
  "",
  "SplitResult insertRec(Node* n, int k) {",
  "  if (n is leaf) insert k sorted;",
  "  if (leaf overflows) splitLeaf();",
  "  else {",
  "    find child, recurse;",
  "    if child split, insert separator;",
  "    if internal overflows, splitInternal();",
  "  }",
  "}",
  "",
  "void splitLeaf(Node* n) {",
  "  copy right half → new leaf;",
  "  first key of new leaf → separator;",
  "  link leaves;",
  "}",
  "",
  "void delete(B+Tree &T, int k) {",
  "  deleteRec(root, k);",
  "  if underflow: borrow or merge;",
  "  update separator keys;",
  "}",
];

const PRESETS_INSERT = [
  { label: "Small", values: [5, 15, 25, 35, 45], order: 4 },
  { label: "Splits", values: [10, 20, 30, 40, 50, 60, 70, 80, 90], order: 4 },
  { label: "Order 3", values: [3, 7, 1, 14, 8, 5, 11, 17], order: 3 },
  { label: "Large", values: [10, 20, 5, 6, 12, 30, 7, 17, 3, 8, 25, 40, 15, 22, 50], order: 4 },
];

const PRESETS_DELETE = [
  { label: "Del leaf", insert: [5, 15, 25, 35, 45, 55], delete: [35], order: 4 },
  { label: "Del + merge", insert: [10, 20, 30, 40, 50, 60, 70], delete: [20, 50], order: 4 },
  { label: "Multi del", insert: [3, 7, 1, 14, 8, 5, 11, 17, 13], delete: [13, 7, 3], order: 3 },
];

interface BPlusTreeVisualizerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function BPlusTreeVisualizer({ isOpen, onClose }: BPlusTreeVisualizerProps) {
  const { setSteps, reset } = useVisualizerStore();
  const [inputValue, setInputValue] = useState("10, 20, 30, 40, 50, 60, 70, 80, 90");
  const [deleteValue, setDeleteValue] = useState("20, 50");
  const [order, setOrder] = useState(4);
  const [mode, setMode] = useState<"insert" | "delete">("insert");
  const [isVisualizing, setIsVisualizing] = useState(false);

  const runInsert = useCallback(
    (values: number[], o: number) => {
      const sim = new BPlusTreeSimulator(o);
      sim.insertSequence(values);
      setSteps(sim.getSteps());
      setIsVisualizing(true);
    },
    [setSteps]
  );

  const runDelete = useCallback(
    (insertVals: number[], deleteVals: number[], o: number) => {
      const sim = new BPlusTreeSimulator(o);
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
        title="B+ TREE"
        VisualizerComponent={<Engine3D />}
        CodeComponent={<CodePane code={BPLUS_CODE} />}
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
            <div className="px-6 py-4 border-b-brutal bg-accent-purple text-white">
              <h2 className="text-2xl font-black uppercase tracking-wider">
                B+ Tree
              </h2>
              <p className="text-sm font-bold mt-1">Insertion &amp; Deletion with leaf linking</p>
            </div>

            <div className="p-6 space-y-5">
              <div className="flex gap-2">
                {(["insert", "delete"] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => setMode(m)}
                    className={`flex-1 py-2 text-sm font-black uppercase border-brutal transition-all ${
                      mode === m ? "bg-accent-purple text-white shadow-brutal-sm" : "bg-white hover:bg-surface-alt"
                    }`}
                  >
                    {m}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider">Order:</span>
                {[3, 4, 5].map((o) => (
                  <button
                    key={o}
                    onClick={() => setOrder(o)}
                    className={`px-3 py-1 text-sm font-black border-brutal-thin transition-all ${
                      order === o ? "bg-accent-purple text-white shadow-brutal-sm" : "bg-white"
                    }`}
                  >
                    {o}
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
                      className="px-3 py-2 text-xs font-black uppercase border-brutal bg-white hover:bg-accent-purple hover:text-white shadow-brutal-sm active:shadow-none active:translate-x-0.5 active:translate-y-0.5 transition-all"
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
