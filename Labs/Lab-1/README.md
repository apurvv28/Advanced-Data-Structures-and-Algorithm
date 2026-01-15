# Assignment 1: Advanced Data Structures and Algorithms
## Binary Search Trees and Binary Trees Implementation

---

## 1. Binary Tree Implementation

### Overview
This program implements a basic binary tree with common operations. It features an interactive menu system for performing various tree operations.

### Tree Node data structure
```java
class Node {
    int data;          // Data stored in node
    Node left, right;  // References to left and right children
}
```

### Functions and Pseudocode

#### 1. `insert(Node root, int data)`
```pseudocode
FUNCTION insert(root, data):
    IF root IS NULL:
        CREATE new Node with data
        RETURN new node
    
    IF data < root.data:
        root.left = insert(root.left, data)
    ELSE:
        root.right = insert(root.right, data)
    
    RETURN root
END FUNCTION
```

#### 2. `inorder(Node root)`
```pseudocode
FUNCTION inorder(root):
    IF root IS NULL:
        RETURN
    
    inorder(root.left)
    PRINT root.data
    inorder(root.right)
END FUNCTION
```

#### 3. `preorder(Node root)`
```pseudocode
FUNCTION preorder(root):
    IF root IS NULL:
        RETURN
    
    PRINT root.data
    preorder(root.left)
    preorder(root.right)
END FUNCTION
```

#### 4. `postorder(Node root)`
```pseudocode
FUNCTION postorder(root):
    IF root IS NULL:
        RETURN
    
    postorder(root.left)
    postorder(root.right)
    PRINT root.data
END FUNCTION
```

#### 5. `height(Node root)`
```pseudocode
FUNCTION height(root):
    IF root IS NULL:
        RETURN 0
    
    leftHeight = height(root.left)
    rightHeight = height(root.right)
    
    RETURN MAX(leftHeight, rightHeight) + 1
END FUNCTION
```

#### 6. `displayleafNodes(Node root)`
```pseudocode
FUNCTION displayleafNodes(root):
    IF root IS NULL:
        RETURN
    
    IF root.left IS NULL AND root.right IS NULL:
        PRINT root.data
    
    displayleafNodes(root.left)
    displayleafNodes(root.right)
END FUNCTION
```

#### 7. `copyTree(Node root)`
```pseudocode
FUNCTION copyTree(root):
    IF root IS NULL:
        RETURN NULL
    
    CREATE newNode with root.data
    newNode.left = copyTree(root.left)
    newNode.right = copyTree(root.right)
    
    RETURN newNode
END FUNCTION
```

### Menu Operations
The program provides an interactive menu with 8 options for tree manipulation and traversal.

---

## 2. Binary Search Tree (BST) Implementation

### Overview
This program implements a Binary Search Tree with standard operations including insertion, deletion, search, and BFS traversal.

### Key Features
- BST property maintenance (left < parent < right)
- Node deletion with three cases
- Breadth-First Search (BFS) traversal

### Functions and Pseudocode

#### 1. `insert(Node root, int data)` - BST Version
```pseudocode
FUNCTION insert(root, data):
    IF root IS NULL:
        CREATE new Node with data
        RETURN new node
    
    IF data < root.data:
        root.left = insert(root.left, data)
    ELSE IF data > root.data:
        root.right = insert(root.right, data)
    
    RETURN root
END FUNCTION
```

#### 2. `deleteNode(Node root, int key)`
```pseudocode
FUNCTION deleteNode(root, key):
    IF root IS NULL:
        RETURN root
    
    IF key < root.data:
        root.left = deleteNode(root.left, key)
    ELSE IF key > root.data:
        root.right = deleteNode(root.right, key)
    ELSE:
        // Node with key found
        CASE 1: Node has no left child
            RETURN root.right
        CASE 2: Node has no right child
            RETURN root.left
        CASE 3: Node has two children
            root.data = minValue(root.right)
            root.right = deleteNode(root.right, root.data)
    
    RETURN root
END FUNCTION
```

#### 3. `minValue(Node root)`
```pseudocode
FUNCTION minValue(root):
    min = root.data
    WHILE root.left IS NOT NULL:
        min = root.left.data
        root = root.left
    RETURN min
END FUNCTION
```

#### 4. `searchNode(Node root, int key)`
```pseudocode
FUNCTION searchNode(root, key):
    IF root IS NULL OR root.data == key:
        RETURN root
    
    IF root.data > key:
        RETURN searchNode(root.left, key)
    ELSE:
        RETURN searchNode(root.right, key)
END FUNCTION
```

#### 5. `BFS(Node root)` - Breadth-First Search
```pseudocode
FUNCTION BFS(root):
    IF root IS NULL:
        RETURN root
    
    CREATE empty queue
    ADD root to queue
    
    WHILE queue IS NOT EMPTY:
        current = REMOVE from queue
        PRINT current.data
        
        IF current.left IS NOT NULL:
            ADD current.left to queue
        IF current.right IS NOT NULL:
            ADD current.right to queue
    
    RETURN root
END FUNCTION
```

### Menu Operations
The BST program provides 6 interactive options for tree operations.

---

## 3. BST2 with Recursive vs Iterative Traversals

### Overview
This program demonstrates both recursive and iterative implementations of tree traversals, along with tree balance checking.

### Key Features
- Three traversal methods (inorder, preorder, postorder)
- Both recursive and iterative implementations
- Tree height calculation
- Tree balance checking

### Iterative Traversal Functions

#### 1. `inorderStack(Node root)` - Iterative Inorder
```pseudocode
FUNCTION inorderStack(root):
    IF root IS NULL:
        RETURN
    
    CREATE empty stack
    
    WHILE TRUE:
        WHILE root IS NOT NULL:
            PUSH root to stack
            root = root.left
        
        IF stack IS EMPTY:
            BREAK
        
        root = POP from stack
        PRINT root.data
        root = root.right
END FUNCTION
```

#### 2. `preorderStack(Node root)` - Iterative Preorder
```pseudocode
FUNCTION preorderStack(root):
    IF root IS NULL:
        RETURN
    
    CREATE empty stack
    PUSH root to stack
    
    WHILE stack IS NOT EMPTY:
        node = POP from stack
        PRINT node.data
        
        IF node.right IS NOT NULL:
            PUSH node.right to stack
        IF node.left IS NOT NULL:
            PUSH node.left to stack
END FUNCTION
```

#### 3. `postorderStack(Node root)` - Iterative Postorder
```pseudocode
FUNCTION postorderStack(root):
    IF root IS NULL:
        RETURN
    
    CREATE stack1, stack2
    PUSH root to stack1
    
    WHILE stack1 IS NOT EMPTY:
        node = POP from stack1
        PUSH node to stack2
        
        IF node.left IS NOT NULL:
            PUSH node.left to stack1
        IF node.right IS NOT NULL:
            PUSH node.right to stack1
    
    WHILE stack2 IS NOT EMPTY:
        node = POP from stack2
        PRINT node.data
END FUNCTION
```

### Tree Analysis Functions

#### 1. `isBalanced(Node root)`
```pseudocode
FUNCTION isBalanced(root):
    IF root IS NULL:
        RETURN TRUE
    
    leftHeight = height(root.left)
    rightHeight = height(root.right)
    
    IF ABS(leftHeight - rightHeight) <= 1 
       AND isBalanced(root.left) 
       AND isBalanced(root.right):
        RETURN TRUE
    
    RETURN FALSE
END FUNCTION
```

#### 2. `height(Node root)` - Same as in BT class
```pseudocode
FUNCTION height(root):
    IF root IS NULL:
        RETURN 0
    
    leftHeight = height(root.left)
    rightHeight = height(root.right)
    
    RETURN MAX(leftHeight, rightHeight) + 1
END FUNCTION
```

---


## Time Complexity Analysis

### Common Operations
| Operation | Time Complexity | Space Complexity |
|-----------|----------------|------------------|
| Insertion | O(h) | O(h) recursive stack |
| Deletion | O(h) | O(h) recursive stack |
| Search | O(h) | O(h) recursive stack |
| Traversal | O(n) | O(h) recursive stack |
| Height | O(n) | O(h) recursive stack |
| BFS | O(n) | O(w) where w = max width |

Where:
- **h** = height of tree (O(log n) for balanced, O(n) for skewed)
- **n** = number of nodes in tree
- **w** = maximum width of tree

---

## Compilation and Execution

```bash
# Compile each program separately
javac BinaryTree.java
javac BST.java
javac BST2.java

# Execute each program
java BinaryTree
java BST
java BST2
```

---
