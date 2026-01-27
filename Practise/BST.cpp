#include <iostream>
#include <queue>
using namespace std;
struct Node{
    int data;
    Node* left;
    Node* right;
};
void insert(Node *&root, int key){
    if(root==nullptr){
        root=new Node();
        root->data=key;
        root->left=nullptr;
        root->right=nullptr;
        return;
    }
    if(key<root->data){
        insert(root->left,key);
    }else{
        insert(root->right,key);
    }   
}
Node *findMin(Node *root){
    while(root&&root->left!=nullptr){
        root=root->left;
    }
    return root;
}
void deleteNode(Node *&root, int key)
{
    if(root==nullptr){
        cout<<"Element"<<key<<"not found!"<<endl;
        return;
    }
    if(key<root->data){
        deleteNode(root->left,key);
    }else if(key>root->data){
        deleteNode(root->right,key);
    }else{
        if(root->left==nullptr){
            Node *temp=root->right;
            delete root;
            root=temp;
        }
        else if(root->right==nullptr){
            Node *temp=root->left;
            delete root;
            root=temp;
        }
        else{
            Node *temp=findMin(root->right);
            root->data=temp->data;
            deleteNode(root->right,temp->data);
        }
        cout<<"Deleted "<<key<<endl;
    }
}
void search(Node *root,int key){
    if(root==nullptr){
        cout<<"Key Not Found!"<<endl;
        return;
    }
    if(root->data == key){
        cout<<"Key "<<key<<" found in the tree!"<<endl;
    }else if(key<root->data){
        search(root->left,key);
    }else{
        search(root->right,key);
    }
}
void displayInOrder(Node *root){
    if(root==nullptr){
        return;
    }
    displayInOrder(root->left);
    cout<<root->data<<" ";
    displayInOrder(root->right);
}
void printCurrentLevel(Node* root,int level) {
    if(root == nullptr){
        return;
    }
    if(level==1){
        cout<<root->data<<" ";
    }else if(level > 1){
        printCurrentLevel(root->left,level-1);
        printCurrentLevel(root->right,level-1);
    }
}
int getHeight(Node *root){
    if(root==nullptr){
        return -1;
    }
    return 1 + max(getHeight(root->left), getHeight(root->right));
}
void BFS(Node* root){
    int h=getHeight(root);
    for(int i=1;i<=h+1;i++){
        printCurrentLevel(root,i);
    }
}
int main(){
    Node *root = nullptr;
    int ch, in;
    while (true)
    {
        cout << "\nChoice Menu";
        cout << "\n1. Insert\n2. Delete\n3. Search\n4. Display\n5. BFS\n6. Height Check\n7. Exit";
        cout << "\nEnter choice: ";
        cin >> ch;
        switch (ch)
        {
        case 1:
            cout << "Enter value to insert: ";
            cin >> in;
            insert(root, in);
            break;
        case 2:
            cout << "Enter value to delete: ";
            cin >> in;
            deleteNode(root, in);
            break;
        case 3:
            cout << "Enter value to search: ";
            cin >> in;
            search(root, in);
            break;
        case 4:
            cout << "In-order: ";
            displayInOrder(root);
            cout << endl;
            break;
        case 5:
            cout << "BFS (Level wise): ";
            BFS(root);
            cout << endl;
            break;
        case 6:
            cout << "Current Height: " << getHeight(root) << endl;
            break;
        case 7:
            cout << "Program ended" << endl;
            return 0;
        default:
            cout << "Invalid choice" << endl;
        }
    }
    return 0;
}