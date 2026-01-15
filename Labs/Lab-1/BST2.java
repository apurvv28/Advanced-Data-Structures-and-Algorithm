import java.util.Stack;

class Node {
    int data;
    Node left, right;

    public Node(int item) {
        data = item;
        left = right = null;
    }
}
public class BST2 {
    Node root;
    BST2() {
        root = null;
    }
    Node insert(Node root, int data) {
        if (root == null) {
            root = new Node(data);
            return root;
        }
        if (data < root.data) {
            root.left = insert(root.left, data);
        }
        else if (data > root.data) {
            root.right = insert(root.right, data);
        }
        return root;
    }
    void inorderStack(Node root) {
        if (root == null){
            return;
        }
        Stack<Node> stack = new Stack<>();
        while (true) {  
            while (root != null) {
                stack.push(root);
                root = root.left;
            }
            if (stack.isEmpty()){
                break;
            }
            root = stack.pop();
            System.out.print(root.data + " ");
            root = root.right;
        }
    }
    void preorderStack(Node root) {
        if (root == null){
            return;
        }
        Stack<Node> stack = new Stack<>();
        stack.push(root);
        while (!stack.isEmpty()){
            Node node = stack.pop();
            System.out.print(node.data + " ");
            if (node.right != null){
                stack.push(node.right);
            }
            if (node.left != null){
                stack.push(node.left);
            }
        }
    }
    void postorderStack(Node root) {
        if (root == null){
            return;
        }
        Stack<Node> stack1 = new Stack<>();
        Stack<Node> stack2 = new Stack<>();
        stack1.push(root);
        while (!stack1.isEmpty()){
            Node node = stack1.pop();
            stack2.push(node);
            if (node.left != null){
                stack1.push(node.left);
            }
            if (node.right != null){
                stack1.push(node.right);
            }
        }
        while (!stack2.isEmpty()){
            Node node = stack2.pop();
            System.out.print(node.data + " ");
        }
    }
    void inorderRecursive(Node root) {
        if (root == null) {
            return;
        }
        inorderRecursive(root.left);
        System.out.print(root.data + " ");
        inorderRecursive(root.right);
    }
    void preorderRecursive(Node root) {
        if (root == null) {
            return;
        }
        System.out.print(root.data + " ");
        preorderRecursive(root.left);
        preorderRecursive(root.right);
    }
    void postorderRecursive(Node root) {
        if (root == null) {
            return;
        }
        postorderRecursive(root.left);
        postorderRecursive(root.right);
        System.out.print(root.data + " ");
    }
    int height(Node root) {
        if (root == null) {
            return 0;
        }
        int lh = height(root.left);
        int rh = height(root.right);    
        return Math.max(lh, rh) + 1;
    }
    boolean isBalanced(Node root) {
        if (root == null) {
            return true;
        }
        int lh = height(root.left);
        int rh = height(root.right);
        if (Math.abs(lh - rh) <= 1 && isBalanced(root.left) && isBalanced(root.right)) {
            return true;
        }
        return false;
    }
    public static void main(String[] args) {
        int keys[] = new int[]{15, 10, 20, 8, 12, 16, 25};
        BST2 tree = new BST2();
        for (int key : keys) {
            tree.root = tree.insert(tree.root, key);
        }
        System.out.println("Inorder Recursive:");
        tree.inorderRecursive(tree.root);
        System.out.println();
        System.out.println("Inorder Iterative:");
        tree.inorderStack(tree.root);
        System.out.println();
        System.out.println("Preorder Recursive:");
        tree.preorderRecursive(tree.root);
        System.out.println();
        System.out.println("Preorder Iterative:");
        tree.preorderStack(tree.root);
        System.out.println();
        System.out.println("Postorder Recursive:");
        tree.postorderRecursive(tree.root);
        System.out.println();
        System.out.println("Postorder Iterative:");
        tree.postorderStack(tree.root);
        System.out.println();
        System.out.println("Height of Tree: " + tree.height(tree.root));
        System.out.println("Is Tree Balanced: " + tree.isBalanced(tree.root));
    }
}
