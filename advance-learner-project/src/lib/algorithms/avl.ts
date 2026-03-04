import { NodeState, VisualizerStep, EdgeState } from "@/store/useVisualizerStore";

class AVLNode {
  value: number;
  id: string;
  left: AVLNode | null = null;
  right: AVLNode | null = null;
  height: number = 1;
  x: number = 0;
  y: number = 0;

  constructor(value: number) {
    this.value = value;
    this.id = `node-${value}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

export class AVLSimulator {
  private root: AVLNode | null = null;
  private steps: VisualizerStep[] = [];

  private readonly VERTICAL_SPACING = 2;
  private readonly START_Y = 5;

  public getSteps(): VisualizerStep[] {
    return this.steps;
  }

  private takeSnapshot(
    activeCodeLine: number,
    explanation: string,
    highlightNodes: string[] = [],
    stateOverrides: Record<string, NodeState["state"]> = {}
  ) {
    this.updateCoordinates();

    const nodes: NodeState[] = [];
    const edges: EdgeState[] = [];

    const traverse = (node: AVLNode | null) => {
      if (!node) return;

      let state: NodeState["state"] = "default";
      if (highlightNodes.includes(node.id)) state = "highlighted";
      if (stateOverrides[node.id]) state = stateOverrides[node.id];

      nodes.push({
        id: node.id,
        value: node.value,
        x: node.x,
        y: node.y,
        state,
      });

      if (node.left) {
        edges.push({ from: node.id, to: node.left.id, state: "default" });
        traverse(node.left);
      }
      if (node.right) {
        edges.push({ from: node.id, to: node.right.id, state: "default" });
        traverse(node.right);
      }
    };

    traverse(this.root);
    this.steps.push({
      nodes: [...nodes],
      edges: [...edges],
      activeCodeLine,
      explanation,
    });
  }

  private updateCoordinates() {
    this.calculatePositions(this.root, 0, this.START_Y, 4);
  }

  private calculatePositions(
    node: AVLNode | null,
    x: number,
    y: number,
    offset: number
  ) {
    if (!node) return;
    node.x = x;
    node.y = y;
    this.calculatePositions(
      node.left,
      x - offset,
      y - this.VERTICAL_SPACING,
      offset / 1.8
    );
    this.calculatePositions(
      node.right,
      x + offset,
      y - this.VERTICAL_SPACING,
      offset / 1.8
    );
  }

  private getHeight(node: AVLNode | null): number {
    return node ? node.height : 0;
  }

  private getBalance(node: AVLNode | null): number {
    return node ? this.getHeight(node.left) - this.getHeight(node.right) : 0;
  }

  // ── Rotations with step-by-step snapshots ──────────────────────

  private rightRotate(y: AVLNode, codeLine: number): AVLNode {
    const x = y.left!;
    const T2 = x.right;

    // Step 1 – show which nodes are about to rotate
    this.takeSnapshot(
      codeLine,
      `RIGHT ROTATE on ${y.value}: node ${x.value} will become new parent`,
      [y.id, x.id],
      { [y.id]: "rotating", [x.id]: "rotating" }
    );

    // Step 2 – rewire pointers
    x.right = y;
    y.left = T2;

    // Step 3 – snapshot after pointer change (positions stale → animate)
    this.takeSnapshot(
      codeLine,
      `Rewiring: ${x.value}.right = ${y.value}${T2 ? `, ${y.value}.left = ${T2.value}` : ""}`,
      [y.id, x.id],
      { [y.id]: "swapping", [x.id]: "highlighted" }
    );

    // Update heights
    y.height =
      Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;
    x.height =
      Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;

    // Step 4 – final positions
    this.updateCoordinates();
    this.takeSnapshot(
      codeLine,
      `Right rotation complete. ${x.value} is now the subtree root`,
      [x.id],
      { [x.id]: "inserted" }
    );

    return x;
  }

  private leftRotate(x: AVLNode, codeLine: number): AVLNode {
    const y = x.right!;
    const T2 = y.left;

    this.takeSnapshot(
      codeLine,
      `LEFT ROTATE on ${x.value}: node ${y.value} will become new parent`,
      [x.id, y.id],
      { [x.id]: "rotating", [y.id]: "rotating" }
    );

    y.left = x;
    x.right = T2;

    this.takeSnapshot(
      codeLine,
      `Rewiring: ${y.value}.left = ${x.value}${T2 ? `, ${x.value}.right = ${T2.value}` : ""}`,
      [x.id, y.id],
      { [x.id]: "swapping", [y.id]: "highlighted" }
    );

    x.height =
      Math.max(this.getHeight(x.left), this.getHeight(x.right)) + 1;
    y.height =
      Math.max(this.getHeight(y.left), this.getHeight(y.right)) + 1;

    this.updateCoordinates();
    this.takeSnapshot(
      codeLine,
      `Left rotation complete. ${y.value} is now the subtree root`,
      [y.id],
      { [y.id]: "inserted" }
    );

    return y;
  }

  // ── Public API ─────────────────────────────────────────────────

  public insertSequence(values: number[]) {
    this.steps = [];
    this.root = null;
    for (const val of values) {
      this.takeSnapshot(-1, `── Inserting ${val} into the AVL tree ──`);
      this.root = this.insert(this.root, val);
      this.updateCoordinates();
      this.takeSnapshot(-1, `Insertion of ${val} complete. Tree is balanced.`);
    }
  }

  // ── Recursive insert with rotation detection ──────────────────

  private insert(node: AVLNode | null, value: number): AVLNode {
    if (!node) {
      const newNode = new AVLNode(value);
      if (!this.root) this.root = newNode;
      newNode.x = 0;
      newNode.y = this.START_Y;
      this.takeSnapshot(3, `Created new node: ${value}`, [newNode.id], {
        [newNode.id]: "inserted",
      });
      return newNode;
    }

    this.takeSnapshot(5, `Comparing ${value} with ${node.value}`, [node.id], {
      [node.id]: "highlighted",
    });

    if (value < node.value) {
      this.takeSnapshot(6, `${value} < ${node.value} → go LEFT`, [node.id], {
        [node.id]: "highlighted",
      });
      node.left = this.insert(node.left, value);
    } else if (value > node.value) {
      this.takeSnapshot(8, `${value} > ${node.value} → go RIGHT`, [node.id], {
        [node.id]: "highlighted",
      });
      node.right = this.insert(node.right, value);
    } else {
      return node; // no duplicates
    }

    // Update height
    node.height =
      1 + Math.max(this.getHeight(node.left), this.getHeight(node.right));
    const balance = this.getBalance(node);

    this.takeSnapshot(
      12,
      `Balance(${node.value}) = ${balance}${Math.abs(balance) > 1 ? " ⚠ UNBALANCED!" : " ✓"}`,
      [node.id],
      { [node.id]: Math.abs(balance) > 1 ? "rotating" : "default" }
    );

    // Left-Left Case
    if (balance > 1 && value < node.left!.value) {
      this.takeSnapshot(
        15,
        `LEFT-LEFT case at ${node.value} → RIGHT rotation needed`,
        [node.id, node.left!.id],
        { [node.id]: "rotating", [node.left!.id]: "rotating" }
      );
      return this.rightRotate(node, 16);
    }

    // Right-Right Case
    if (balance < -1 && value > node.right!.value) {
      this.takeSnapshot(
        19,
        `RIGHT-RIGHT case at ${node.value} → LEFT rotation needed`,
        [node.id, node.right!.id],
        { [node.id]: "rotating", [node.right!.id]: "rotating" }
      );
      return this.leftRotate(node, 20);
    }

    // Left-Right Case
    if (balance > 1 && value > node.left!.value) {
      this.takeSnapshot(
        23,
        `LEFT-RIGHT case at ${node.value} → double rotation needed`,
        [node.id, node.left!.id],
        { [node.id]: "rotating", [node.left!.id]: "swapping" }
      );
      node.left = this.leftRotate(node.left!, 24);
      this.takeSnapshot(25, `First rotation done. Now RIGHT rotate at ${node.value}`, [node.id], {
        [node.id]: "rotating",
      });
      return this.rightRotate(node, 25);
    }

    // Right-Left Case
    if (balance < -1 && value < node.right!.value) {
      this.takeSnapshot(
        29,
        `RIGHT-LEFT case at ${node.value} → double rotation needed`,
        [node.id, node.right!.id],
        { [node.id]: "rotating", [node.right!.id]: "swapping" }
      );
      node.right = this.rightRotate(node.right!, 30);
      this.takeSnapshot(31, `First rotation done. Now LEFT rotate at ${node.value}`, [node.id], {
        [node.id]: "rotating",
      });
      return this.leftRotate(node, 31);
    }

    return node;
  }
}
