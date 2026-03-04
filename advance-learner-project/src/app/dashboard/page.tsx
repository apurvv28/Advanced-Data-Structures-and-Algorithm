"use client";

import { useState } from "react";
import {
  Search,
  Trees,
  Network,
  Waypoints,
  Target,
  Route,
  Database,
  Layers,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { AVLVisualizer } from "@/components/visualizer/AVLVisualizer";
import { RBTVisualizer } from "@/components/visualizer/RBTVisualizer";
import { BTreeVisualizer } from "@/components/visualizer/BTreeVisualizer";
import { BPlusTreeVisualizer } from "@/components/visualizer/BPlusTreeVisualizer";

const algorithms = [
  {
    id: "avl",
    title: "AVL Tree",
    category: "tree",
    description:
      "Self-balancing BST where heights of child subtrees differ by at most one. Watch rotations happen in real-time.",
    icon: <Trees className="w-5 h-5" />,
    accentColor: "#FFE500",
  },
  {
    id: "rbt",
    title: "Red Black Tree",
    category: "tree",
    description:
      "Self-balancing BST with color-based rebalancing. Insert & delete with rotations and recoloring.",
    icon: <Network className="w-5 h-5" />,
    accentColor: "#FF6B6B",
  },
  {
    id: "btree",
    title: "B-Tree",
    category: "tree",
    description:
      "Self-balancing multi-way search tree, ideal for disk-based storage. Splits and merges on insert & delete.",
    icon: <Database className="w-5 h-5" />,
    accentColor: "#FF9F1C",
  },
  {
    id: "bplustree",
    title: "B+ Tree",
    category: "tree",
    description:
      "B-Tree variant with all values in leaves linked together. Efficient range queries with leaf chain.",
    icon: <Layers className="w-5 h-5" />,
    accentColor: "#9B5DE5",
  },
  {
    id: "dijkstra",
    title: "Dijkstra's Algorithm",
    category: "graph",
    description:
      "Finds shortest paths between nodes in a weighted graph with non-negative edge costs.",
    icon: <Route className="w-5 h-5" />,
    accentColor: "#4D9FFF",
  },
  {
    id: "astar",
    title: "A* Search",
    category: "graph",
    description:
      "Graph traversal and path search using heuristics for optimal pathfinding.",
    icon: <Target className="w-5 h-5" />,
    accentColor: "#00CC66",
  },
  {
    id: "kruskal",
    title: "Kruskal's Algorithm",
    category: "graph",
    description:
      "Minimum spanning tree algorithm finding least-weight edges connecting all vertices.",
    icon: <Waypoints className="w-5 h-5" />,
    accentColor: "#FF9F1C",
  },
];

export default function DashboardPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filtered = algorithms.filter((a) =>
    a.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Search */}
        <div className="flex justify-center mb-12">
          <div className="relative w-full max-w-2xl">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted w-5 h-5 pointer-events-none" />
            <input
              type="text"
              placeholder="SEARCH ALGORITHMS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border-brutal bg-white py-4 pl-12 pr-6 text-text-primary font-bold placeholder:text-text-muted placeholder:font-black placeholder:uppercase placeholder:tracking-wider shadow-brutal focus:outline-none focus:shadow-brutal-lg transition-all"
            />
          </div>
        </div>

        {/* Trees */}
        <section className="mb-12">
          <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
            <span className="w-4 h-8 bg-primary border-brutal inline-block" />
            Trees
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered
              .filter((a) => a.category === "tree")
              .map((algo) => (
                <Card
                  key={algo.id}
                  title={algo.title}
                  description={algo.description}
                  icon={algo.icon}
                  accentColor={algo.accentColor}
                  onClick={() => setActiveModal(algo.id)}
                />
              ))}
          </div>
        </section>

        {/* Graphs */}
        <section className="mb-12">
          <h2 className="text-2xl font-black uppercase mb-6 flex items-center gap-3">
            <span className="w-4 h-8 bg-accent-blue border-brutal inline-block" />
            Graph Algorithms
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filtered
              .filter((a) => a.category === "graph")
              .map((algo) => (
                <Card
                  key={algo.id}
                  title={algo.title}
                  description={algo.description}
                  icon={algo.icon}
                  accentColor={algo.accentColor}
                  onClick={() => setActiveModal(algo.id)}
                />
              ))}
          </div>
        </section>
      </div>

      {/* Modals */}
      <AVLVisualizer
        isOpen={activeModal === "avl"}
        onClose={() => setActiveModal(null)}
      />
      <RBTVisualizer
        isOpen={activeModal === "rbt"}
        onClose={() => setActiveModal(null)}
      />
      <BTreeVisualizer
        isOpen={activeModal === "btree"}
        onClose={() => setActiveModal(null)}
      />
      <BPlusTreeVisualizer
        isOpen={activeModal === "bplustree"}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
