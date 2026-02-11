#include <iostream>
using namespace std;
struct Node{
    int data;
    Node* left;
    Node* right;

};
Node* createNode(int data){
    Node* newNode = new Node();
    newNode->data = data;
    newNode->left = nullptr;
    newNode->right = nullptr;
    return newNode;
}
Node* insert(Node* root, int data){
    if(root == nullptr){
        return createNode(data);
    }
    if(data < root->data){
        root->left = insert(root->left,data);
    }else{
        root->right=insert(root->right,data);
    }
    return root;
}
void display(Node* root){
    if(root==nullptr){
        return;
    }
    display(root->left);
    cout<<root->data<<" ";
    display(root->right);
}
int height(Node* root){
    if(root==nullptr){
        return 0;
    }
    int leftH = height(root->left);
    int rightH = height(root->right);
    return max(leftH,rightH)+1;
}
Node* displayLeafNode(Node* root){
    if(root==nullptr){
        return nullptr;
    }
    if(root->left==nullptr && root->right==nullptr){
        cout<<root->data<<" ";
    }
    displayLeafNode(root->left);
    displayLeafNode(root->right);
    return root;
}
Node* copyTree(Node* root){
    if(root==nullptr){
        return nullptr;
    }
    Node* newNode = createNode(root->data);
    newNode->left = copyTree(root->left);
    newNode->right = copyTree(root->right);
    return newNode;
}
int main(){
    Node* root = nullptr;
    Node* newTree = nullptr;
    root = insert(root,50);
    int choice, data;
    while(true){
        cout<<"Menu:"<<endl;
        cout<<"1. Insert"<<endl;
        cout<<"2. Display - Inorder"<<endl;
        cout<<"3. Height"<<endl;
        cout<<"4. Display Leaf Nodes"<<endl;
        cout<<"5. Copy Tree"<<endl;
        cout<<"6. Exit"<<endl;
        cout<<"Enter your choice: ";
        cin>>choice;
        switch(choice){
            case 1:
                cout<<"\nEnter data to insert : ";
                cin>>data;
                root = insert(root,data);
                break;
            case 2:
                cout<<"\nDisplay Tree: (Inorder) ";
                display(root);
                cout<<endl;
                break;
            case 3:
                cout<<"\nHeight of Tree : "<<height(root)<<endl;
                break;
            case 4:
                cout<<"\nDisplaying Leaf Nodes: ";
                displayLeafNode(root);
                cout<<endl;
                break;
            case 5:
                newTree = copyTree(root);
                cout<<"\nCopied Tree: ";
                display(newTree);
                cout<<endl;
                break;
            case 6:
                cout<<"\nExiting..."<<endl;
                return 0;
            default:
                cout<<"\nInvalid Choice!"<<endl;
                break;
        }
    }
    return 0;
}