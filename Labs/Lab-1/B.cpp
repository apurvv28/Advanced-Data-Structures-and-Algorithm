#include<iostream>
#include<queue>
using namespace std;

struct Node{
    int data;
    Node* l;
    Node* r;
};

Node* create(int data){
    Node* root=new Node();
    root->data=data;
    root->l=NULL;
    root->r=NULL;
    return root;
}

void display(Node* root){
    if(root==NULL){
        return;
    }
    display(root->l);
    cout<<root->data<<" ";
    display(root->r);
}

Node* insert(Node* root, int data){
    if(root==NULL){
        return create(data);
    }
    if(data>=root->data){
        root->r=insert(root->r,data);
    }else{
        root->l=insert(root->l,data);
    }
    return root;
}

Node* minimum(Node* root){
    while(root&&root->l!=NULL){
        root=root->l;
    }
    return root;
}

Node* del(Node* root, int data){
    if(root==NULL){
        return root;
    }
    if(data<root->data){
        root->l=del(root->l,data);
    }else if(data>root->data){
        root->r=del(root->r,data);
    }else{
        if(root->l==NULL){
            Node* t=root->r;
            delete root;
            return t;
        }else if(root->r==NULL){
            Node* t=root->l;
            delete root;
            return t;
        }else{
            Node* t=minimum(root->r);
            root->data=t->data;
            root->r=del(root->r,t->data);
        }
        return root;
    }
}

int search(Node* root, int val){
    if(root==NULL){
        cout<<"Value not found"<<endl;
        return 0;
    }
    if(root->data==val){
        cout<<"Value found"<<endl;
    }else if(val<root->data){
        search(root->l,val);
    }
    else{
        search(root->r,val);
    }
}

void bfs(Node* root) {
    if(root==NULL) {
        return;
    }
    queue<Node*> q;
    q.push(root);
    while (!q.empty()) {
        Node* temp=q.front();
        q.pop();
        cout<<temp->data<<" ";
        if(temp->l!=NULL){
            q.push(temp->l);
        }
        if (temp->r != NULL){
            q.push(temp->r);
        }
    }
}

int main(){
    Node* root=NULL;
    int ch, val;
    while(true){
    cout<<"Menu:"<<endl;
    cout<<"1. Insert"<<endl;
    cout<<"2. Display"<<endl;
    cout<<"3. Delete"<<endl;
    cout<<"4. Search"<<endl;
    cout<<"5. BFS"<<endl;
    cout<<"6. Exit"<<endl;
    cout<<"Enter your choice: ";
    cin>>ch;
    switch(ch){
        case 1:
        cout<<"Enter data to insert:";
        cin>>val;
        root=insert(root,val);
        cout<<"Node inserted in tree"<<endl;
        break;
        case 2:
        cout<<"Inorder Tree: ";
        display(root);
        cout<<endl;
        break;
        case 3:
        cout<<"Which value to delete?"<<endl;
        cin>>val;
        root=del(root,val);
        cout<<"Node deleted"<<endl;
        break;
        case 4:
        cout<<"Which value to search?"<<endl;
        cin>>val;
        search(root,val);
        break;
        case 5:
        cout<<"BFS Traversal: "<<endl;
        bfs(root);
        cout<<endl;
        break;
        case 6:
        cout<<"BYE BYE User!"<<endl;
        return 0;
        default:
        cout<<"Invalid Choice!"<<endl;
        break;
    }     
    }
    return 0;
}