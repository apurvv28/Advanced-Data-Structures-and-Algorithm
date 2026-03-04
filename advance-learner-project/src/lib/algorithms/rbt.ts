import { NodeState, VisualizerStep, EdgeState } from "@/store/useVisualizerStore";

type Color = "RED" | "BLACK";

class RBNode {
  value: number;
  id: string;
  left: RBNode | null = null;
  right: RBNode | null = null;
  parent: RBNode | null = null;
  color: Color = "RED";
  x = 0;
  y = 0;

  constructor(value: number, color: Color = "RED") {
    this.value = value;
    this.color = color;
    this.id = `rb-${value}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class RBTSimulator {
  private root: RBNode | null = null;
  private NIL: RBNode;
  private steps: VisualizerStep[] = [];
  private readonly VERT = 2;
  private readonly TOP_Y = 5;

  constructor() {
    this.NIL = new RBNode(0, "BLACK");
    this.NIL.id = "NIL";
    this.NIL.left = this.NIL;
    this.NIL.right = this.NIL;
    this.NIL.parent = this.NIL;
  }

  public getSteps() {
    return this.steps;
  }

  /* ── snapshot helpers ──────────────────────────────────────── */

  private snap(codeLine: number, explanation: string, highlights: string[] = [], overrides: Record<string, NodeState["state"]> = {}) {
    this.updateCoords();
    const nodes: NodeState[] = [];
    const edges: EdgeState[] = [];

    const walk = (n: RBNode | null) => {
      if (!n || n === this.NIL) return;

      let state: NodeState["state"] = n.color === "RED" ? "rotating" : "default";
      if (highlights.includes(n.id)) state = "highlighted";
      if (overrides[n.id]) state = overrides[n.id];

      nodes.push({ id: n.id, value: n.value, x: n.x, y: n.y, state, meta: { rbColor: n.color } });

      if (n.left && n.left !== this.NIL) {
        edges.push({ from: n.id, to: n.left.id, state: "default" });
        walk(n.left);
      }
      if (n.right && n.right !== this.NIL) {
        edges.push({ from: n.id, to: n.right.id, state: "default" });
        walk(n.right);
      }
    };

    walk(this.root);
    this.steps.push({ nodes: [...nodes], edges: [...edges], activeCodeLine: codeLine, explanation });
  }

  private updateCoords() {
    this.calc(this.root, 0, this.TOP_Y, 4.5);
  }

  private calc(n: RBNode | null, x: number, y: number, off: number) {
    if (!n || n === this.NIL) return;
    n.x = x;
    n.y = y;
    this.calc(n.left, x - off, y - this.VERT, off / 1.8);
    this.calc(n.right, x + off, y - this.VERT, off / 1.8);
  }

  /* ── rotations ─────────────────────────────────────────────── */

  private leftRotate(x: RBNode) {
    const y = x.right!;
    this.snap(-1, `LEFT ROTATE on ${x.value}`, [x.id, y.id], { [x.id]: "swapping", [y.id]: "swapping" });

    x.right = y.left;
    if (y.left && y.left !== this.NIL) y.left.parent = x;
    y.parent = x.parent;

    if (!x.parent || x.parent === this.NIL) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;

    y.left = x;
    x.parent = y;

    this.snap(-1, `Left rotation done. ${y.value} replaced ${x.value}`, [y.id], { [y.id]: "inserted" });
  }

  private rightRotate(y: RBNode) {
    const x = y.left!;
    this.snap(-1, `RIGHT ROTATE on ${y.value}`, [y.id, x.id], { [y.id]: "swapping", [x.id]: "swapping" });

    y.left = x.right;
    if (x.right && x.right !== this.NIL) x.right.parent = y;
    x.parent = y.parent;

    if (!y.parent || y.parent === this.NIL) this.root = x;
    else if (y === y.parent.left) y.parent.left = x;
    else y.parent.right = x;

    x.right = y;
    y.parent = x;

    this.snap(-1, `Right rotation done. ${x.value} replaced ${y.value}`, [x.id], { [x.id]: "inserted" });
  }

  /* ── insert ────────────────────────────────────────────────── */

  public insertSequence(values: number[]) {
    this.steps = [];
    this.root = null;
    for (const v of values) {
      this.snap(-1, `── Inserting ${v} ──`);
      this.insert(v);
      this.snap(-1, `Insertion of ${v} complete.`);
    }
  }

  private insert(val: number) {
    const z = new RBNode(val, "RED");
    z.left = this.NIL;
    z.right = this.NIL;
    z.parent = this.NIL;

    let y: RBNode | null = null;
    let x = this.root;

    while (x && x !== this.NIL) {
      y = x;
      this.snap(5, `Comparing ${val} with ${x.value}`, [x.id], { [x.id]: "highlighted" });
      if (val < x.value) x = x.left;
      else if (val > x.value) x = x.right;
      else return; // dup
    }

    z.parent = y ?? this.NIL;
    if (!y) {
      this.root = z;
    } else if (val < y.value) {
      y.left = z;
    } else {
      y.right = z;
    }

    this.snap(3, `Created RED node ${val}`, [z.id], { [z.id]: "inserted" });
    this.insertFixup(z);
  }

  private insertFixup(z: RBNode) {
    while (z.parent && z.parent !== this.NIL && z.parent.color === "RED") {
      const gp = z.parent.parent;
      if (!gp || gp === this.NIL) break;

      if (z.parent === gp.left) {
        const uncle = gp.right;
        if (uncle && uncle !== this.NIL && uncle.color === "RED") {
          // Case 1 – recolor
          this.snap(9, `Uncle ${uncle.value} is RED → recolor`, [z.id, uncle.id, gp.id], { [z.id]: "rotating", [uncle.id]: "rotating", [gp.id]: "swapping" });
          z.parent.color = "BLACK";
          uncle.color = "BLACK";
          gp.color = "RED";
          z = gp;
          this.snap(9, `Recolored. Moving up to ${z.value}`, [z.id]);
        } else {
          if (z === z.parent.right) {
            // Case 2 – left rotate
            this.snap(13, `Case 2: ${z.value} is right child → left rotate parent`, [z.id], { [z.id]: "swapping" });
            z = z.parent;
            this.leftRotate(z);
          }
          // Case 3 – recolor + right rotate
          this.snap(16, `Case 3: recolor + right rotate grandparent`, [z.id]);
          z.parent!.color = "BLACK";
          gp.color = "RED";
          this.rightRotate(gp);
        }
      } else {
        // Mirror
        const uncle = gp.left;
        if (uncle && uncle !== this.NIL && uncle.color === "RED") {
          this.snap(9, `Uncle ${uncle.value} is RED → recolor`, [z.id, uncle.id, gp.id], { [z.id]: "rotating", [uncle.id]: "rotating", [gp.id]: "swapping" });
          z.parent.color = "BLACK";
          uncle.color = "BLACK";
          gp.color = "RED";
          z = gp;
          this.snap(9, `Recolored. Moving up to ${z.value}`, [z.id]);
        } else {
          if (z === z.parent.left) {
            this.snap(13, `Case 2 (mirror): ${z.value} is left child → right rotate parent`, [z.id], { [z.id]: "swapping" });
            z = z.parent;
            this.rightRotate(z);
          }
          this.snap(16, `Case 3 (mirror): recolor + left rotate grandparent`, [z.id]);
          z.parent!.color = "BLACK";
          gp.color = "RED";
          this.leftRotate(gp);
        }
      }
    }
    if (this.root) this.root.color = "BLACK";
    this.snap(-1, `Root is BLACK. Tree is valid.`);
  }

  /* ── delete ────────────────────────────────────────────────── */

  public deleteSequence(insertVals: number[], deleteVals: number[]) {
    this.steps = [];
    this.root = null;
    for (const v of insertVals) {
      this.insert(v);
    }
    this.snap(-1, `Tree built. Starting deletions.`);
    for (const v of deleteVals) {
      this.snap(-1, `── Deleting ${v} ──`);
      this.deleteNode(v);
      this.snap(-1, `Deletion of ${v} complete.`);
    }
  }

  private findNode(val: number): RBNode | null {
    let cur = this.root;
    while (cur && cur !== this.NIL) {
      if (val === cur.value) return cur;
      cur = val < cur.value ? cur.left : cur.right;
    }
    return null;
  }

  private minimum(n: RBNode): RBNode {
    while (n.left && n.left !== this.NIL) n = n.left;
    return n;
  }

  private transplant(u: RBNode, v: RBNode) {
    if (!u.parent || u.parent === this.NIL) this.root = v;
    else if (u === u.parent.left) u.parent.left = v;
    else u.parent.right = v;
    v.parent = u.parent;
  }

  private deleteNode(val: number) {
    const z = this.findNode(val);
    if (!z) {
      this.snap(-1, `Node ${val} not found.`);
      return;
    }

    this.snap(20, `Found node ${val} to delete`, [z.id], { [z.id]: "swapping" });

    let y = z;
    let yOrigColor = y.color;
    let x: RBNode;

    if (!z.left || z.left === this.NIL) {
      x = z.right ?? this.NIL;
      this.transplant(z, x);
    } else if (!z.right || z.right === this.NIL) {
      x = z.left ?? this.NIL;
      this.transplant(z, x);
    } else {
      y = this.minimum(z.right!);
      yOrigColor = y.color;
      x = y.right ?? this.NIL;

      this.snap(25, `Successor is ${y.value}`, [y.id], { [y.id]: "highlighted" });

      if (y.parent === z) {
        x.parent = y;
      } else {
        this.transplant(y, x);
        y.right = z.right;
        if (y.right) y.right.parent = y;
      }
      this.transplant(z, y);
      y.left = z.left;
      if (y.left) y.left.parent = y;
      y.color = z.color;
    }

    this.snap(28, `Node removed. Checking balance...`);

    if (yOrigColor === "BLACK") {
      this.deleteFixup(x);
    }
  }

  private deleteFixup(x: RBNode) {
    while (x !== this.root && x.color === "BLACK") {
      if (x === x.parent?.left) {
        let w = x.parent.right;
        if (!w || w === this.NIL) break;

        if (w.color === "RED") {
          this.snap(30, `Case 1: sibling ${w.value} is RED → recolor + left rotate`, [w.id], { [w.id]: "rotating" });
          w.color = "BLACK";
          x.parent.color = "RED";
          this.leftRotate(x.parent);
          w = x.parent.right;
          if (!w || w === this.NIL) break;
        }

        const wl = w.left;
        const wr = w.right;
        if ((!wl || wl === this.NIL || wl.color === "BLACK") && (!wr || wr === this.NIL || wr.color === "BLACK")) {
          this.snap(32, `Case 2: sibling's children both BLACK → recolor sibling`, [w.id]);
          w.color = "RED";
          x = x.parent;
        } else {
          if (!wr || wr === this.NIL || wr.color === "BLACK") {
            this.snap(34, `Case 3: sibling's right child BLACK → right rotate sibling`, [w.id]);
            if (wl && wl !== this.NIL) wl.color = "BLACK";
            w.color = "RED";
            this.rightRotate(w);
            w = x.parent!.right;
            if (!w || w === this.NIL) break;
          }
          this.snap(36, `Case 4: left rotate parent, recolor`, [w.id, x.parent!.id]);
          w.color = x.parent!.color;
          x.parent!.color = "BLACK";
          if (w.right && w.right !== this.NIL) w.right.color = "BLACK";
          this.leftRotate(x.parent!);
          x = this.root!;
        }
      } else {
        // Mirror
        let w = x.parent?.left;
        if (!w || w === this.NIL) break;

        if (w.color === "RED") {
          this.snap(30, `Case 1 (mirror): sibling ${w.value} RED → recolor + right rotate`, [w.id], { [w.id]: "rotating" });
          w.color = "BLACK";
          x.parent!.color = "RED";
          this.rightRotate(x.parent!);
          w = x.parent!.left;
          if (!w || w === this.NIL) break;
        }

        const wl = w.left;
        const wr = w.right;
        if ((!wl || wl === this.NIL || wl.color === "BLACK") && (!wr || wr === this.NIL || wr.color === "BLACK")) {
          this.snap(32, `Case 2 (mirror): recolor sibling`, [w.id]);
          w.color = "RED";
          x = x.parent!;
        } else {
          if (!wl || wl === this.NIL || wl.color === "BLACK") {
            this.snap(34, `Case 3 (mirror): left rotate sibling`, [w.id]);
            if (wr && wr !== this.NIL) wr.color = "BLACK";
            w.color = "RED";
            this.leftRotate(w);
            w = x.parent!.left;
            if (!w || w === this.NIL) break;
          }
          this.snap(36, `Case 4 (mirror): right rotate parent, recolor`, [w.id]);
          w.color = x.parent!.color;
          x.parent!.color = "BLACK";
          if (w.left && w.left !== this.NIL) w.left.color = "BLACK";
          this.rightRotate(x.parent!);
          x = this.root!;
        }
      }
    }
    x.color = "BLACK";
    this.snap(-1, `Fixup done. Tree is valid.`);
  }
}
