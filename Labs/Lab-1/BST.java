import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;
class Node {
    int data;
    Node left, right;
    Node(int item) {
        data = item;
        left = right = null;
    }
}
class BST {
    Node root;
    BST() {
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
    void inorder(Node root) {
        if (root != null) {
            inorder(root.left);
            System.out.print(root.data + " ");
            inorder(root.right);
        }
    }
    
    Node deleteNode(Node root, int key) {
        if (root == null) {
            return root;
        }
        if (key < root.data) {
            root.left = deleteNode(root.left, key);
        }
        else if (key > root.data) {
            root.right = deleteNode(root.right, key);
        }
        else {
            if (root.left == null)
                return root.right;
            else if (root.right == null)
                return root.left;
            root.data = minValue(root.right);
            root.right = deleteNode(root.right, root.data);
        }
        return root;
    }
    int minValue(Node root) {
        int minv = root.data;
        while (root.left != null) {
            minv = root.left.data;
            root = root.left;
        }
        return minv;
    }
    Node searchNode(Node root, int key) {
        if (root == null || root.data == key) {
            return root;
        }
        if (root.data > key) {
            return searchNode(root.left, key);
        }
        return searchNode(root.right, key);
    }
    Node BFS(Node root) {
        if (root == null) {
            return root;
        }
        Queue<Node> q = new LinkedList<Node>();
        q.add(root);
        while (!q.isEmpty()) {
            Node temp = q.poll();
            System.out.print(temp.data + " ");
            if (temp.left != null) {
                q.add(temp.left);
            }
            if (temp.right != null) {
                q.add(temp.right);
            }
        }
        return root;
    }

    public static void main(String[] args) {
        System.out.println("Binary Search Tree Operations:");
        BST tree = new BST();
        Scanner sc = new Scanner(System.in);
        boolean exit = false;
        while (!exit) { 
            System.out.println("Menu:");
            System.out.println("1. Insert");
            System.out.println("2. Inorder Traversal");
            System.out.println("3. Delete Node");
            System.out.println("4. Search Node");
            System.out.println("5. BFS");
            System.out.println("6. Exit");
            System.out.print("Enter your choice: ");
            int choice = sc.nextInt(); 
            switch (choice) {
                case 1:
                    System.out.print("Enter value to insert: ");
                    int valToInsert = sc.nextInt();
                    tree.root = tree.insert(tree.root, valToInsert);
                    System.out.println("Inserted " + valToInsert);
                    break;  
                case 2:
                    System.out.print("Inorder Traversal: ");
                    tree.inorder(tree.root);
                    System.out.println();
                    break;
                case 3:
                    System.out.print("Enter value to delete: ");
                    int valToDelete = sc.nextInt();
                    tree.root = tree.deleteNode(tree.root, valToDelete);
                    System.out.println("Deleted " + valToDelete);
                    break;
                case 4:
                    System.out.print("Enter value to search: ");
                    int valToSearch = sc.nextInt();
                    Node searchResult = tree.searchNode(tree.root, valToSearch);
                    if (searchResult != null) {
                        System.out.println("Found " + valToSearch + " at node with address: " + searchResult);
                    } else {
                        System.out.println("Not found " + valToSearch);
                    }
                    break;
                case 5:
                    System.out.print("BFS Traversal: ");
                    tree.BFS(tree.root);
                    System.out.println();
                    break;
                case 6:
                    System.out.println("Exiting...");
                    exit = true;
                    break;
                default:
                    System.out.println("Invalid choice! Please try again.");
            }
        }
        sc.close();
    }
}
