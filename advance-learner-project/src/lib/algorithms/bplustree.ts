import { NodeState, VisualizerStep, EdgeState } from "@/store/useVisualizerStore";

/**
 * B+ Tree simulator with step-by-step insertion & deletion.
 * Leaf nodes are linked (conceptually). All data lives in leaves;
 * internal nodes hold only separator keys.
 */

interface KeyPos { x: number; y: number; }

class BPlusNode {
  keys: number[] = [];
  children: BPlusNode[] = [];
  next: BPlusNode | null = null; // leaf linked list
  id: string;
  leaf: boolean = true;
  _pos: Map<number, KeyPos> = new Map();

  constructor() {
    this.id = `bp-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class BPlusTreeSimulator {
  private root: BPlusNode;
  private order: number; // max keys = order-1
  private steps: VisualizerStep[] = [];
  private readonly TOP_Y = 6;
  private readonly VERT = 2.5;
  private readonly KEY_GAP = 1.6;

  constructor(order: number = 4) {
    this.order = order;
    this.root = new BPlusNode();
  }

  public getSteps() { return this.steps; }

  /* ── snapshot ────────────────────────────────────────────── */

  private snap(line: number, explanation: string, hl: string[] = [], ov: Record<string, NodeState["state"]> = {}) {
    const nodes: NodeState[] = [];
    const edges: EdgeState[] = [];
    const w = this.treeW(this.root);
    this.layout(this.root, -w / 2, this.TOP_Y, w);
    this.collect(this.root, nodes, edges, hl, ov);
    this.steps.push({ nodes: [...nodes], edges: [...edges], activeCodeLine: line, explanation });
  }

  private treeW(n: BPlusNode): number {
    if (n.leaf) return Math.max(n.keys.length * this.KEY_GAP, this.KEY_GAP);
    let w = 0;
    for (const c of n.children) w += this.treeW(c);
    return Math.max(w, n.keys.length * this.KEY_GAP);
  }

  private layout(node: BPlusNode, xStart: number, y: number, allocW: number) {
    const kw = node.keys.length * this.KEY_GAP;
    const cx = xStart + allocW / 2 - kw / 2;
    for (let i = 0; i < node.keys.length; i++) {
      node._pos.set(i, { x: cx + i * this.KEY_GAP, y });
    }
    if (!node.leaf) {
      const cw = node.children.map(c => this.treeW(c));
      const total = cw.reduce((a, b) => a + b, 0);
      let childX = xStart + (allocW - total) / 2;
      for (let i = 0; i < node.children.length; i++) {
        this.layout(node.children[i], childX, y - this.VERT, cw[i]);
        childX += cw[i];
      }
    }
  }

  private collect(node: BPlusNode, ns: NodeState[], es: EdgeState[], hl: string[], ov: Record<string, NodeState["state"]>) {
    for (let i = 0; i < node.keys.length; i++) {
      const kid = `${node.id}-k${i}`;
      let state: NodeState["state"] = node.leaf ? "default" : "highlighted";
      if (hl.includes(kid)) state = "highlighted";
      if (ov[kid]) state = ov[kid];
      // internal nodes get blue tint (highlighted state) by default to distinguish from leaves
      if (!node.leaf && !hl.includes(kid) && !ov[kid]) state = "highlighted";
      const pos = node._pos.get(i);
      ns.push({ id: kid, value: node.keys[i], x: pos?.x ?? 0, y: pos?.y ?? 0, state });
    }

    // Leaf-to-leaf linked list edge
    if (node.leaf && node.next && node.next.keys.length > 0) {
      const fromId = `${node.id}-k${node.keys.length - 1}`;
      const toId = `${node.next.id}-k0`;
      es.push({ from: fromId, to: toId, state: "active" });
    }

    if (!node.leaf) {
      for (let i = 0; i < node.children.length; i++) {
        const child = node.children[i];
        if (child.keys.length === 0) continue;
        const fi = Math.min(i, node.keys.length - 1);
        es.push({ from: `${node.id}-k${fi}`, to: `${child.id}-k0`, state: "default" });
        this.collect(child, ns, es, hl, ov);
      }
    }
  }

  /* ── insert public ──────────────────────────────────────── */

  public insertSequence(values: number[]) {
    this.steps = [];
    this.root = new BPlusNode();
    for (const v of values) {
      this.snap(-1, `── Inserting ${v} into B+ Tree (order=${this.order}) ──`);
      this.insert(v);
      this.snap(-1, `Insertion of ${v} complete.`);
    }
  }

  public deleteSequence(insertVals: number[], deleteVals: number[]) {
    this.steps = [];
    this.root = new BPlusNode();
    for (const v of insertVals) this.insert(v);
    this.snap(-1, `B+ Tree built. Starting deletions.`);
    for (const v of deleteVals) {
      this.snap(-1, `── Deleting ${v} ──`);
      this.delete(v);
      this.snap(-1, `Deletion of ${v} complete.`);
    }
  }

  /* ── insert core ────────────────────────────────────────── */

  private insert(k: number) {
    const result = this.insertRec(this.root, k);
    if (result) {
      // Root was split
      this.snap(4, `Root split. New root with key ${result.key}`, [], { [`${this.root.id}-k0`]: "rotating" });
      const newRoot = new BPlusNode();
      newRoot.leaf = false;
      newRoot.keys.push(result.key);
      newRoot.children.push(result.left, result.right);
      this.root = newRoot;
      this.snap(4, `New root created: ${result.key}`);
    }
  }

  private insertRec(node: BPlusNode, k: number): { key: number; left: BPlusNode; right: BPlusNode } | null {
    if (node.leaf) {
      // Insert into sorted position
      let i = 0;
      while (i < node.keys.length && k > node.keys[i]) i++;
      if (i < node.keys.length && node.keys[i] === k) return null; // dup
      node.keys.splice(i, 0, k);
      this.snap(8, `Inserted ${k} into leaf`, [], { [`${node.id}-k${i}`]: "inserted" });

      if (node.keys.length >= this.order) {
        return this.splitLeaf(node);
      }
      return null;
    }

    // Internal node – find child
    let i = 0;
    while (i < node.keys.length && k >= node.keys[i]) i++;
    this.snap(10, `Traversing to child ${i}`, [], { [`${node.id}-k${Math.min(i, node.keys.length - 1)}`]: "highlighted" });

    const result = this.insertRec(node.children[i], k);
    if (result) {
      // Child was split – insert separator
      node.keys.splice(i, 0, result.key);
      node.children.splice(i, 1, result.left, result.right);
      this.snap(12, `Separator ${result.key} added to internal node`, [], { [`${node.id}-k${i}`]: "rotating" });

      if (node.keys.length >= this.order) {
        return this.splitInternal(node);
      }
    }
    return null;
  }

  private splitLeaf(node: BPlusNode): { key: number; left: BPlusNode; right: BPlusNode } {
    const mid = Math.ceil(node.keys.length / 2);
    const right = new BPlusNode();
    right.keys = node.keys.splice(mid);
    right.leaf = true;
    right.next = node.next;
    node.next = right;

    const separator = right.keys[0];
    this.snap(14, `Leaf split. Separator ${separator} goes up`, [], { [`${node.id}-k${node.keys.length - 1}`]: "swapping" });
    return { key: separator, left: node, right };
  }

  private splitInternal(node: BPlusNode): { key: number; left: BPlusNode; right: BPlusNode } {
    const mid = Math.floor(node.keys.length / 2);
    const pushUpKey = node.keys[mid];

    const right = new BPlusNode();
    right.leaf = false;
    right.keys = node.keys.splice(mid + 1);
    node.keys.splice(mid); // remove pushed-up key
    right.children = node.children.splice(mid + 1);

    this.snap(16, `Internal split. Key ${pushUpKey} pushed up`, [], {});
    return { key: pushUpKey, left: node, right };
  }

  /* ── delete core ────────────────────────────────────────── */

  private delete(k: number) {
    this.deleteRec(this.root, k);
    if (!this.root.leaf && this.root.keys.length === 0) {
      this.root = this.root.children[0] || new BPlusNode();
    }
  }

  private deleteRec(node: BPlusNode, k: number) {
    if (node.leaf) {
      const idx = node.keys.indexOf(k);
      if (idx === -1) {
        this.snap(-1, `Key ${k} not found`);
        return;
      }
      this.snap(19, `Removing ${k} from leaf`, [], { [`${node.id}-k${idx}`]: "swapping" });
      node.keys.splice(idx, 1);
      return;
    }

    // Find correct child
    let i = 0;
    while (i < node.keys.length && k >= node.keys[i]) i++;
    this.snap(21, `Descending to child ${i} for key ${k}`);

    this.deleteRec(node.children[i], k);

    // Fix underflow
    const minKeys = Math.ceil(this.order / 2) - 1;
    if (node.children[i].keys.length < minKeys) {
      this.snap(23, `Underflow in child → fixing`, [], {});
      this.fixUnderflow(node, i);
    }

    // Update separator keys if needed
    this.updateKeys(node);
  }

  private fixUnderflow(parent: BPlusNode, idx: number) {
    const child = parent.children[idx];
    const leftSib = idx > 0 ? parent.children[idx - 1] : null;
    const rightSib = idx < parent.children.length - 1 ? parent.children[idx + 1] : null;
    const minKeys = Math.ceil(this.order / 2) - 1;

    if (leftSib && leftSib.keys.length > minKeys) {
      // Borrow from left
      this.snap(25, `Borrow from left sibling`);
      if (child.leaf) {
        child.keys.unshift(leftSib.keys.pop()!);
        parent.keys[idx - 1] = child.keys[0];
      } else {
        child.keys.unshift(parent.keys[idx - 1]);
        parent.keys[idx - 1] = leftSib.keys.pop()!;
        child.children.unshift(leftSib.children.pop()!);
      }
    } else if (rightSib && rightSib.keys.length > minKeys) {
      // Borrow from right
      this.snap(25, `Borrow from right sibling`);
      if (child.leaf) {
        child.keys.push(rightSib.keys.shift()!);
        parent.keys[idx] = rightSib.keys[0];
      } else {
        child.keys.push(parent.keys[idx]);
        parent.keys[idx] = rightSib.keys.shift()!;
        child.children.push(rightSib.children.shift()!);
      }
    } else {
      // Merge
      if (leftSib) {
        this.snap(27, `Merging with left sibling`);
        if (child.leaf) {
          leftSib.keys.push(...child.keys);
          leftSib.next = child.next;
        } else {
          leftSib.keys.push(parent.keys[idx - 1], ...child.keys);
          leftSib.children.push(...child.children);
        }
        parent.keys.splice(idx - 1, 1);
        parent.children.splice(idx, 1);
      } else if (rightSib) {
        this.snap(27, `Merging with right sibling`);
        if (child.leaf) {
          child.keys.push(...rightSib.keys);
          child.next = rightSib.next;
        } else {
          child.keys.push(parent.keys[idx], ...rightSib.keys);
          child.children.push(...rightSib.children);
        }
        parent.keys.splice(idx, 1);
        parent.children.splice(idx + 1, 1);
      }
    }
  }

  private updateKeys(node: BPlusNode) {
    if (node.leaf) return;
    for (let i = 1; i < node.children.length; i++) {
      let leftmost = node.children[i];
      while (!leftmost.leaf) leftmost = leftmost.children[0];
      if (leftmost.keys.length > 0 && i - 1 < node.keys.length) {
        node.keys[i - 1] = leftmost.keys[0];
      }
    }
  }
}
