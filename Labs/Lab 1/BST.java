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