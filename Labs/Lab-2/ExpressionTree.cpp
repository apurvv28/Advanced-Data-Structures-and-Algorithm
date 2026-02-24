#include<iostream>
#include<stack>
#include <cctype>
using namespace std;

struct Node{
    char data;
    Node* l;
    Node* r;
};
Node* create(char data){
    Node* root=new Node();
    root->data=data;
    root->l=NULL;
    root->r=NULL;
    return root;
}
void inorder(Node* root){
    if(root!=NULL){
        inorder(root->l);
        cout<<root->data<<" ";
        inorder(root->r);
    }
}
void preorder(Node* root){
    if(root!=NULL){
        cout<<root->data<<" ";
        preorder(root->l);
        preorder(root->r);
    }
}
void postorder(Node* root){
    if(root!=NULL){
        postorder(root->l);
        postorder(root->r);
        cout<<root->data<<" ";
    }
}
Node* constructTree(string exp){
    stack<Node*> st;
    for(int i=0;i<exp.length();i++){
        if(isalnum(exp[i])){
            Node* root=create(exp[i]);
            st.push(root);
        }else{
            Node* root=create(exp[i]);
            root->r=st.top();
            st.pop();
            root->l=st.top();
            st.pop();
            st.push(root);
        }
    }
    return st.top();
}
void inorderNR(Node* root){
    stack<Node*> st;
    Node* a=root;
    while(a!=NULL || !st.empty()){
        while(a!=NULL){
            st.push(a);
            a=a->l;
        }
        Node* temp=st.top();
        st.pop();
        cout<<temp->data<<" ";
        a=temp->r;
    }
}
void preorderNR(Node* root){
    stack<Node*> st;
    st.push(root);
    while(!st.empty()){
        Node* temp=st.top();
        st.pop();
        cout<<temp->data<<" ";
        if(temp->r!=NULL){
            st.push(temp->r);
        }
        if(temp->l!=NULL){
            st.push(temp->l);
        }
    }
}
int main(){
    string exp;
    int c=0;
    cout<<"Enter postfix expression: "<<endl;
    cin>>exp;
    Node* root = constructTree(exp);
    while(c!=3){
    cout<<"Menu :"<<endl;
    cout<<"1. Recursive Traversals"<<endl;
    cout<<"2. Non-Recursive Traversals"<<endl;
    cout<<"Enter your choice: "<<endl;
    cin>>c;
    switch(c){
        case 1:
            cout<<"Recursive Traversals"<<endl;
            cout<<"Inorder: "<<endl;
            inorder(root);
            cout<<endl;
            cout<<"Preorder: "<<endl;
            preorder(root);
            cout<<endl;
            cout<<"Postorder: "<<endl;
            postorder(root);
            cout<<endl;
            break;
        case 2:
            cout<<"Non-Recursive Traversals"<<endl;
            cout<<"Inorder: "<<endl;
            inorderNR(root);
            cout<<endl;
            cout<<"Preorder: "<<endl;
            preorderNR(root);
            cout<<endl;
            break;
        case 3:
            cout<<"Bye Bye"<<endl;
            return 0;
        default:
            cout<<"Invalid Choice!"<<endl;
            break;
    }
    }
}