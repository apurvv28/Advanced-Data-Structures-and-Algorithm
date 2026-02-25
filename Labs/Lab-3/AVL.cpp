#include <iostream>
using namespace std;
struct Node{
    public:
    int data;
    Node* l;
    Node* r;
    int height;
};
Node* create(int data){
    Node* root=new Node();
    root->data=data;
    root->l=NULL;
    root->r=NULL;
    root->height=1;
    return root;
}
int height(Node* root){
    return root==NULL ? 0 : root->height;
}
int balance(Node* root){
    return root==NULL ? 0 : height(root->l)-height(root->r);
}
Node* LL(Node* root){
    Node* x=root->l;
    Node* y=x->r;

    x->r=root;
    root->l=y;

    root->height=max(height(root->l),height(root->r))+1;
    x->height=max(height(x->l),height(x->r))+1;
    return x;
}
Node* RR(Node* root){
    Node* x=root->r;
    Node* y=x->l;

    x->l=root;
    root->r=y;

    root->height=max(height(root->l),height(root->r))+1;
    x->height=max(height(x->l),height(x->r))+1;
    return x;
}
Node* insert(Node* root,int data){
    if(root==NULL){
        return create(data);
    }
    if(data<root->data){
        root->l=insert(root->l,data);
    }else if(data>root->data){
        root->r=insert(root->r,data);
    }
    int b=balance(root);
    //LL Right Rotation
    if(b>1&&data<root->l->data){
        cout << "Performing LL (Right) rotation" << endl;
        return LL(root);
    }
    //RR Left Rotation
    if(b<-1&&data>root->r->data){
        cout << "Performing RR (Left) rotation" << endl;
        return RR(root);
    }
    //Left after Right Rotation
    if(b>1&&data>root->l->data){
        cout << "Performing LR rotation" << endl;
        root->l=RR(root->l);
        return LL(root);
    }
    //Right after left rotation
    if(b<-1&&data<root->r->data){
        cout << "Performing RL rotation" << endl;
        root->r=LL(root->r);
        return RR(root);
    }
    root->height = 1 + max(height(root->l), height(root->r));
    return root;
}
Node* minValueNode(Node* node){
    Node* current = node;
    while(current->l != NULL){
        current = current->l;
    }
    return current;
}
Node* deleteNode(Node* root, int data){
    if(root == NULL) return root;
    if(data < root->data){
        root->l = deleteNode(root->l, data);
    }else if(data > root->data){
        root->r = deleteNode(root->r, data);
    }else{
        if(root->l == NULL){
            Node* temp = root->r;
            delete root;
            return temp;
        }else if(root->r == NULL){
            Node* temp = root->l;
            delete root;
            return temp;
        }
        Node* temp = minValueNode(root->r);
        root->data = temp->data;
        root->r = deleteNode(root->r, temp->data);
    }
    if(root == NULL) return root;
    root->height = 1 + max(height(root->l), height(root->r));
    int b = balance(root);
    if(b > 1 && balance(root->l) >= 0){
        cout << "Performing LL (Right) rotation after deletion" << endl;
        return LL(root);
    }
    if(b > 1 && balance(root->l) < 0){
        cout << "Performing LR rotation after deletion" << endl;
        root->l = RR(root->l);
        return LL(root);
    }
    if(b < -1 && balance(root->r) <= 0){
        cout << "Performing RR (Left) rotation after deletion" << endl;
        return RR(root);
    }
    if(b < -1 && balance(root->r) > 0){
        cout << "Performing RL rotation after deletion" << endl;
        root->r = LL(root->r);
        return RR(root);
    }
    return root;
}
void display(Node* root){
    if(root!=NULL){
        display(root->l);
        cout<<root->data<<" ";
        display(root->r);
    }
}
int main(){
    int data;
    int c=0;
    Node* root=NULL;
    while(c!=4){
        cout<<"Menu :"<<endl;
        cout<<"1. Insert"<<endl;
        cout<<"2. Delete"<<endl;
        cout<<"3. Display"<<endl;
        cout<<"4. Exit"<<endl;
        cout<<"Enter your choice: "<<endl;
        cin>>c;
        switch(c){
            case 1:
                cout<<"Enter data to insert: "<<endl;
                cin>>data;
                root = insert(root, data);
                break;
            case 2:
                cout<<"Enter data to delete: "<<endl;
                cin>>data;
                root = deleteNode(root, data);
                break;
            case 3:
                cout<<"AVL Tree: "<<endl;
                display(root);
                cout<<endl;
                break;
            case 4:
                cout<<"Bye Bye"<<endl;
                break;
            default:
                cout<<"Choose correct option"<<endl;
        }
    }
}