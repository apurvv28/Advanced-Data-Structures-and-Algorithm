import java.util.Scanner;

class Node {
    int data;
    Node left, right;
    Node(int data){
        this.data = data;
        left=right=null;
    }
}
class BT{
    Node root;
    BT(){
        root = null;
    }
    Node insert(Node root, int data){
        if(root==null){
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
    void inorder(Node root){
        if(root==null){
            return;
        }
        inorder(root.left);
        System.out.print(root.data + " ");
        inorder(root.right);
    }
    void preorder(Node root){
        if(root==null){
            return;
        }
        System.out.print(root.data + " ");
        preorder(root.left);
        preorder(root.right);
    }
    void postorder(Node root){
        if(root==null){
            return;
        }
        postorder(root.left);
        postorder(root.right);
        System.out.print(root.data + " ");
    }
    int height(Node root){
        if(root==null){
            return 0;
        }
        int lh = height(root.left);
        int rh = height(root.right);
        return Math.max(lh, rh) + 1;
    }
    void displayleafNodes(Node root){
        if(root==null){
            return;
        }
        if(root.left==null && root.right==null){
            System.out.print(root.data + " ");
        }
        displayleafNodes(root.left);
        displayleafNodes(root.right);
    }
    Node copyTree(Node root){
        if(root==null){
            return null;
        }
        Node newNode = new Node(root.data);
        newNode.left = copyTree(root.left);
        newNode.right = copyTree(root.right);
        return newNode;
    }
}
class BinaryTree {
    public static void main(String[] args) {
        System.out.println("Binary Tree Operations:");
        System.out.println("Menu:");
        System.out.println("1. Insert");
        System.out.println("2. Inorder Traversal");
        System.out.println("3. Preorder Traversal");
        System.out.println("4. Postorder Traversal");
        System.out.println("5. Height of Tree");
        System.out.println("6. Display Leaf Nodes");
        System.out.println("7. Copy Tree");
        System.out.println("8. Exit");
        BT tree = new BT();
        tree.root = null;
        Scanner sc = new Scanner(System.in);
        boolean exit = false;
        while(!exit){
            System.out.print("Enter your choice: ");
            int choice = sc.nextInt();
            switch(choice){
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
                    System.out.print("Preorder Traversal: ");
                    tree.preorder(tree.root);
                    System.out.println();
                    break;
                case 4:
                    System.out.print("Postorder Traversal: ");
                    tree.postorder(tree.root);
                    System.out.println();
                    break;
                case 5:
                    System.out.println("Height of Tree: " + tree.height(tree.root));
                    break;
                case 6:
                    System.out.println("Leaf Nodes: ");
                    tree.displayleafNodes(tree.root);
                    System.out.println();
                    break;
                case 7:
                    System.out.println("Original Tree: ");
                    tree.inorder(tree.root);
                    System.out.println();
                    BT copiedTree = new BT();
                    System.out.println("Copied Tree: ");
                    copiedTree.root = tree.copyTree(tree.root);
                    copiedTree.inorder(copiedTree.root);
                    System.out.println();
                    break;
                case 8:
                    System.out.println("Exiting...");
                    exit = true;
                    break;
                default:
                    System.out.println("Invalid choice. Please try again.");
            }
        }
        sc.close();
    }
}