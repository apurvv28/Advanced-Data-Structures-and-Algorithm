import { NodeState, VisualizerStep, EdgeState } from "@/store/useVisualizerStore";

/**
 * B-Tree simulator with step-by-step insertion & deletion visualization.
 * Each "node" in the VisualizerStep represents a single KEY inside a B-Tree node.
 * Keys from the same B-Tree node share the same y-coordinate and are placed adjacently.
 */

interface KeyPos { x: number; y: number; }

class BTreeNode {
  keys: number[] = [];
  children: BTreeNode[] = [];
  id: string;
  leaf: boolean = true;
  _pos: Map<number, KeyPos> = new Map();

  constructor() {
    this.id = `btn-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class BTreeSimulator {
  private root: BTreeNode;
  private t: number; // minimum degree
  private steps: VisualizerStep[] = [];
  private readonly TOP_Y = 6;
  private readonly VERT = 2.5;
  private readonly KEY_GAP = 1.6;

  constructor(order: number = 3) {
    this.t = order;
    this.root = new BTreeNode();
  }

  public getSteps() { return this.steps; }

  /* ── snapshot ────────────────────────────────────────────── */

  private snap(line: number, explanation: string, highlights: string[] = [], overrides: Record<string, NodeState["state"]> = {}) {
    const nodes: NodeState[] = [];
    const edges: EdgeState[] = [];
    this.layout(this.root, 0, this.TOP_Y, this.treeWidth(this.root));
    this.collect(this.root, nodes, edges, highlights, overrides);
    this.steps.push({ nodes: [...nodes], edges: [...edges], activeCodeLine: line, explanation });
  }

  /* positions are computed as simple x offsets within allocated width */
  private treeWidth(node: BTreeNode): number {
    if (node.leaf) return Math.max(node.keys.length * this.KEY_GAP, this.KEY_GAP);
    let w = 0;
    for (const c of node.children) w += this.treeWidth(c);
    return Math.max(w, node.keys.length * this.KEY_GAP);
  }

  private layout(node: BTreeNode, xStart: number, y: number, allocW: number) {
    const kw = node.keys.length * this.KEY_GAP;
    const cx = xStart + allocW / 2 - kw / 2;

    // Assign positions to keys in this node
    for (let i = 0; i < node.keys.length; i++) {
      node._pos.set(i, { x: cx + i * this.KEY_GAP, y });
    }

    if (!node.leaf) {
      const childWidths = node.children.map(c => this.treeWidth(c));
      const totalCW = childWidths.reduce((a, b) => a + b, 0);
      let childX = xStart + (allocW - totalCW) / 2;
      for (let i = 0; i < node.children.length; i++) {
        this.layout(node.children[i], childX, y - this.VERT, childWidths[i]);
        childX += childWidths[i];
      }
    }
  }

  private collect(node: BTreeNode, nodes: NodeState[], edges: EdgeState[], hl: string[], ov: Record<string, NodeState["state"]>) {
    for (let i = 0; i < node.keys.length; i++) {
      const kid = `${node.id}-k${i}`;
      let state: NodeState["state"] = "default";
      if (hl.includes(kid)) state = "highlighted";
      if (ov[kid]) state = ov[kid];

      const pos = node._pos.get(i);
      nodes.push({
        id: kid,
        value: node.keys[i],
        x: pos?.x ?? 0,
        y: pos?.y ?? 0,
        state,
      });
    }

    // Edges from parent's first key to each child's first key
    if (!node.leaf) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.keys.length === 0) continue;
        const fromIdx = Math.min(i, node.keys.length - 1);
        const fromId = `${node.id}-k${fromIdx}`;
        const toId = `${child.id}-k0`;
        edges.push({ from: fromId, to: toId, state: "default" });
        this.collect(child, nodes, edges, hl, ov);
      }
    }
  }

  /* ── insert public API ──────────────────────────────────── */

  public insertSequence(values: number[]) {
    this.steps = [];
    this.root = new BTreeNode();
    for (const v of values) {
      this.snap(-1, `── Inserting ${v} into B-Tree (t=${this.t}) ──`);
      this.insertKey(v);
      this.snap(-1, `Insertion of ${v} complete.`);
    }
  }

  public deleteSequence(insertVals: number[], deleteVals: number[]) {
    this.steps = [];
    this.root = new BTreeNode();
    for (const v of insertVals) this.insertKey(v);
    this.snap(-1, `B-Tree built. Starting deletions.`);
    for (const v of deleteVals) {
      this.snap(-1, `── Deleting ${v} ──`);
      this.deleteKey(this.root, v);
      this.snap(-1, `Deletion of ${v} complete.`);
    }
  }

  /* ── insert core ────────────────────────────────────────── */

  private insertKey(k: number) {
    const r = this.root;
    if (r.keys.length === 2 * this.t - 1) {
      this.snap(3, `Root is full → split root`, [], { [`${r.id}-k0`]: "swapping" });
      const s = new BTreeNode();
      s.leaf = false;
      s.children.push(r);
      this.root = s;
      this.splitChild(s, 0);
      this.insertNonFull(s, k);
    } else {
      this.insertNonFull(r, k);
    }
  }

  private splitChild(parent: BTreeNode, i: number) {
    const y = parent.children[i];
    const z = new BTreeNode();
    z.leaf = y.leaf;

    const mid = this.t - 1;
    const medianKey = y.keys[mid];

    this.snap(6, `Splitting node. Median ${medianKey} moves up`, [], { [`${y.id}-k${mid}`]: "rotating" });

    z.keys = y.keys.splice(mid + 1);
    y.keys.splice(mid); // remove median from y

    if (!y.leaf) {
      z.children = y.children.splice(this.t);
    }

    parent.children.splice(i + 1, 0, z);
    parent.keys.splice(i, 0, medianKey);

    this.snap(6, `Split done. ${medianKey} promoted to parent`);
  }

  private insertNonFull(node: BTreeNode, k: number) {
    let i = node.keys.length - 1;

    if (node.leaf) {
      while (i >= 0 && k < node.keys[i]) i--;
      node.keys.splice(i + 1, 0, k);
      this.snap(10, `Inserted ${k} into leaf`, [], { [`${node.id}-k${i + 1}`]: "inserted" });
    } else {
      while (i >= 0 && k < node.keys[i]) i--;
      i++;

      this.snap(12, `Traversing to child ${i}`, [], { [`${node.id}-k${Math.min(i, node.keys.length - 1)}`]: "highlighted" });

      if (node.children[i].keys.length === 2 * this.t - 1) {
        this.splitChild(node, i);
        if (k > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], k);
    }
  }

  /* ── delete core ────────────────────────────────────────── */

  private deleteKey(node: BTreeNode, k: number) {
    const idx = node.keys.indexOf(k);

    if (idx !== -1 && node.leaf) {
      // Case 1: key in leaf
      this.snap(17, `Removing ${k} from leaf`, [], { [`${node.id}-k${idx}`]: "swapping" });
      node.keys.splice(idx, 1);
      return;
    }

    if (idx !== -1) {
      // Case 2: key in internal node
      this.snap(19, `Key ${k} found in internal node`, [], { [`${node.id}-k${idx}`]: "swapping" });

      const leftChild = node.children[idx];
      const rightChild = node.children[idx + 1];

      if (leftChild.keys.length >= this.t) {
        // 2a: predecessor
        const pred = this.getPredecessor(leftChild);
        this.snap(20, `Replace with predecessor ${pred}`, [], { [`${node.id}-k${idx}`]: "highlighted" });
        node.keys[idx] = pred;
        this.deleteKey(leftChild, pred);
      } else if (rightChild.keys.length >= this.t) {
        // 2b: successor
        const succ = this.getSuccessor(rightChild);
        this.snap(22, `Replace with successor ${succ}`, [], { [`${node.id}-k${idx}`]: "highlighted" });
        node.keys[idx] = succ;
        this.deleteKey(rightChild, succ);
      } else {
        // 2c: merge children
        this.snap(24, `Merging children around ${k}`, [], { [`${node.id}-k${idx}`]: "rotating" });
        this.merge(node, idx);
        this.deleteKey(leftChild, k);
      }
    } else {
      // Case 3: key not in node, go to appropriate child
      let i = 0;
      while (i < node.keys.length && k > node.keys[i]) i++;

      if (node.leaf) {
        this.snap(-1, `Key ${k} not found in tree`);
        return;
      }

      const child = node.children[i];
      this.snap(26, `Descending to child for ${k}`, [], { [`${node.id}-k${Math.min(i, node.keys.length - 1)}`]: "highlighted" });

      if (child.keys.length < this.t) {
        this.fill(node, i);
      }

      // After fill, the structure may have changed
      if (i > node.keys.length) {
        this.deleteKey(node.children[i - 1], k);
      } else {
        this.deleteKey(node.children[i], k);
      }
    }

    // If root becomes empty
    if (this.root.keys.length === 0 && !this.root.leaf) {
      this.root = this.root.children[0];
    }
  }

  private getPredecessor(node: BTreeNode): number {
    while (!node.leaf) node = node.children[node.children.length - 1];
    return node.keys[node.keys.length - 1];
  }

  private getSuccessor(node: BTreeNode): number {
    while (!node.leaf) node = node.children[0];
    return node.keys[0];
  }

  private merge(node: BTreeNode, idx: number) {
    const left = node.children[idx];
    const right = node.children[idx + 1];
    left.keys.push(node.keys[idx]);
    left.keys.push(...right.keys);
    if (!left.leaf) left.children.push(...right.children);
    node.keys.splice(idx, 1);
    node.children.splice(idx + 1, 1);
    this.snap(24, `Merged. Key count: ${left.keys.length}`);
  }

  private fill(node: BTreeNode, idx: number) {
    if (idx > 0 && node.children[idx - 1].keys.length >= this.t) {
      this.borrowFromPrev(node, idx);
    } else if (idx < node.children.length - 1 && node.children[idx + 1].keys.length >= this.t) {
      this.borrowFromNext(node, idx);
    } else {
      if (idx < node.children.length - 1) {
        this.merge(node, idx);
      } else {
        this.merge(node, idx - 1);
      }
    }
  }

  private borrowFromPrev(node: BTreeNode, idx: number) {
    const child = node.children[idx];
    const sibling = node.children[idx - 1];
    this.snap(28, `Borrow from left sibling`, [], { [`${sibling.id}-k${sibling.keys.length - 1}`]: "swapping" });

    child.keys.unshift(node.keys[idx - 1]);
    node.keys[idx - 1] = sibling.keys.pop()!;
    if (!sibling.leaf) child.children.unshift(sibling.children.pop()!);
  }

  private borrowFromNext(node: BTreeNode, idx: number) {
    const child = node.children[idx];
    const sibling = node.children[idx + 1];
    this.snap(28, `Borrow from right sibling`, [], { [`${sibling.id}-k0`]: "swapping" });

    child.keys.push(node.keys[idx]);
    node.keys[idx] = sibling.keys.shift()!;
    if (!sibling.leaf) child.children.push(sibling.children.shift()!);
  }
}
