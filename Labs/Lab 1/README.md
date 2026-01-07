# Binary Search Tree (BST) Operations in Java

## Overview
This Java program implements a Binary Search Tree (BST) with operations for insertion, traversal, height calculation, and balance checking.

## Code Explanation Line by Line

### 1. Import Statement
```java
import java.util.*;
```
- Imports all classes from the `java.util` package (though only basic Java features are used here).

### 2. Class Declaration
```java
class Main {
```
- Defines the main class containing all the BST operations.

### 3. Node Class
```java
static class Node {
    int data;
    Node left, right;
    Node(int data) {
        this.data = data;
        left = right = null;
    }
}
```
- **Line 5**: Defines a nested static class `Node` representing a tree node.
- **Line 6**: `int data` stores the node's value.
- **Line 7**: `Node left, right` are references to left and right child nodes.
- **Lines 8-11**: Constructor initializes node with given data and sets children to `null`.

### 4. Insert Method
```java
static Node insert(Node root, int data) {
    if(root == null){
        return new Node(data);
    }
    if(data < root.data){
        root.left = insert(root.left, data);
    }
    else{
        root.right = insert(root.right, data);
    }
    return root;
}
```
- **Line 14-16**: If tree is empty, creates a new node as root.
- **Line 17-19**: If data is less than current node's data, recursively inserts into left subtree.
- **Line 20-22**: Otherwise, recursively inserts into right subtree.
- **Line 23**: Returns the updated root node.

### 5. Inorder Traversal
```java
static void inorder(Node root) {
    if (root == null){
        return;
    }
    inorder(root.left);
    System.out.print(root.data + " ");
    inorder(root.right);
}
```
- **Line 28**: Base case: if node is null, return.
- **Line 30**: Recursively traverses left subtree (Left).
- **Line 31**: Prints current node's data (Root).
- **Line 32**: Recursively traverses right subtree (Right).
- **Output**: Elements in ascending order for BST.

### 6. Preorder Traversal
```java
static void preorder(Node root) {
    if (root == null){
        return;
    }
    System.out.print(root.data + " ");
    preorder(root.left);
    preorder(root.right);
}
```
- **Line 37**: Base case: if node is null, return.
- **Line 39**: Prints current node's data first (Root).
- **Line 40**: Recursively traverses left subtree (Left).
- **Line 41**: Recursively traverses right subtree (Right).

### 7. Height Calculation
```java
static int height(Node root) {
    if (root == null){
        return 0;
    }
    int lh = height(root.left);
    int rh = height(root.right);
    return Math.max(lh, rh) + 1;
}
```
- **Line 46-48**: Base case: empty tree has height 0.
- **Line 49**: Calculates height of left subtree recursively.
- **Line 50**: Calculates height of right subtree recursively.
- **Line 51**: Returns the maximum of left/right heights plus 1 for current node.

### 8. Balance Check
```java
static boolean isBalanced(Node root) {
    if (root == null){
        return true;
    }
    int lh = height(root.left);
    int rh = height(root.right);
    if (Math.abs(lh - rh) > 1){
        return false;
    }
    return isBalanced(root.left) && isBalanced(root.right);
}
```
- **Line 56-58**: Empty tree is balanced by definition.
- **Line 59-60**: Calculates heights of left and right subtrees.
- **Line 61-63**: If height difference > 1, tree is unbalanced.
- **Line 64**: Recursively checks if both subtrees are balanced.

### 9. Main Method
```java
public static void main(String[] args) {
    int[] keys = {10, 5, 15, 3, 7, 12, 18};
    Node root = null;
    for (int key : keys){
        root = insert(root, key);
    }
    System.out.print("Inorder Traversal: ");
    inorder(root);
    System.out.print("\nPreorder Traversal: ");
    preorder(root);
    System.out.println("\nHeight of BST: " + height(root));
    System.out.println("Is Height Balanced: " + isBalanced(root));
}
```
- **Line 67**: Array of values to insert into BST.
- **Line 68**: Initializes empty tree.
- **Lines 69-71**: Inserts all keys into BST.
- **Lines 72-77**: Performs traversals and prints results.

## Algorithm

### 1. BST Insertion Algorithm
```
Algorithm insert(root, data):
    if root is null:
        return new Node(data)
    if data < root.data:
        root.left = insert(root.left, data)
    else:
        root.right = insert(root.right, data)
    return root
```

### 2. Inorder Traversal Algorithm
```
Algorithm inorder(root):
    if root is null:
        return
    inorder(root.left)
    print(root.data)
    inorder(root.right)
```

### 3. Preorder Traversal Algorithm
```
Algorithm preorder(root):
    if root is null:
        return
    print(root.data)
    preorder(root.left)
    preorder(root.right)
```

### 4. Height Calculation Algorithm
```
Algorithm height(root):
    if root is null:
        return 0
    left_height = height(root.left)
    right_height = height(root.right)
    return max(left_height, right_height) + 1
```

### 5. Balance Check Algorithm
```
Algorithm isBalanced(root):
    if root is null:
        return true
    left_height = height(root.left)
    right_height = height(root.right)
    if |left_height - right_height| > 1:
        return false
    return isBalanced(root.left) AND isBalanced(root.right)
```

## Pseudocode

```
CLASS Main:
    CLASS Node:
        data: INTEGER
        left: Node
        right: Node
        
        CONSTRUCTOR(data):
            this.data = data
            left = null
            right = null
    
    FUNCTION insert(root, data):
        IF root == null:
            RETURN new Node(data)
        IF data < root.data:
            root.left = insert(root.left, data)
        ELSE:
            root.right = insert(root.right, data)
        RETURN root
    
    FUNCTION inorder(root):
        IF root == null:
            RETURN
        inorder(root.left)
        PRINT root.data + " "
        inorder(root.right)
    
    FUNCTION preorder(root):
        IF root == null:
            RETURN
        PRINT root.data + " "
        preorder(root.left)
        preorder(root.right)
    
    FUNCTION height(root):
        IF root == null:
            RETURN 0
        lh = height(root.left)
        rh = height(root.right)
        RETURN MAX(lh, rh) + 1
    
    FUNCTION isBalanced(root):
        IF root == null:
            RETURN true
        lh = height(root.left)
        rh = height(root.right)
        IF ABS(lh - rh) > 1:
            RETURN false
        RETURN isBalanced(root.left) AND isBalanced(root.right)
    
    FUNCTION main():
        keys = [10, 5, 15, 3, 7, 12, 18]
        root = null
        
        FOR EACH key IN keys:
            root = insert(root, key)
        
        PRINT "Inorder Traversal: "
        inorder(root)
        PRINT "\nPreorder Traversal: "
        preorder(root)
        PRINT "\nHeight of BST: " + height(root)
        PRINT "Is Height Balanced: " + isBalanced(root)
```

## Complete Code with Output

```java
import java.util.*;

class Main {

    static class Node {
        int data;
        Node left, right;
        Node(int data) {
            this.data = data;
            left = right = null;
        }
    }
    static Node insert(Node root, int data) {
        if(root == null){
            return new Node(data);
        }
        if(data < root.data){
            root.left = insert(root.left, data);
        }
        else{
            root.right = insert(root.right, data);
        }
        return root;
    }
    static void inorder(Node root) {
        if (root == null){
            return;
        }
        inorder(root.left);
        System.out.print(root.data + " ");
        inorder(root.right);
    }
    static void preorder(Node root) {
        if (root == null){
            return;
        }
        System.out.print(root.data + " ");
        preorder(root.left);
        preorder(root.right);
    }
    static int height(Node root) {
        if (root == null){
            return 0;
        }
        int lh = height(root.left);
        int rh = height(root.right);
        return Math.max(lh, rh) + 1;
    }
    static boolean isBalanced(Node root) {
        if (root == null){
            return true;
        }
        int lh = height(root.left);
        int rh = height(root.right);
        if (Math.abs(lh - rh) > 1){
            return false;
        }
        return isBalanced(root.left) && isBalanced(root.right);
    }
    public static void main(String[] args) {
        int[] keys = {10, 5, 15, 3, 7, 12, 18};
        Node root = null;
        for (int key : keys){
            root = insert(root, key);
        }
        System.out.print("Inorder Traversal: ");
        inorder(root);
        System.out.print("\nPreorder Traversal: ");
        preorder(root);
        System.out.println("\nHeight of BST: " + height(root));
        System.out.println("Is Height Balanced: " + isBalanced(root));
    }
}
```

## Output
```
Inorder Traversal: 3 5 7 10 12 15 18 
Preorder Traversal: 10 5 3 7 15 12 18 
Height of BST: 3
Is Height Balanced: true
```

## Tree Structure
The constructed BST looks like:
```
        10
       /  \
      5    15
     / \   / \
    3   7 12  18
```

## Time Complexity
- **Insertion**: O(h) where h is height of tree (O(n) worst, O(log n) best)
- **Traversals**: O(n) where n is number of nodes
- **Height Calculation**: O(n)
- **Balance Check**: O(n²) worst case (can be optimized to O(n) with post-order traversal)