#include <iostream>
using namespace std;

class BTreeNode {
public:
    int *keys;      
    int t;
    int n;         
    bool leaf;      

    BTreeNode(int t, bool leaf){
        this->t=t;
        this->leaf=leaf;
        keys = new int[2*t-1]; 
        n = 0;
    }

    void print(){
        for (int i = 0; i < n; i++)
            cout << keys[i] << " ";
        cout << endl;
    }

    void insert(int k){
        int i=n-1;
        while(i>=0&&keys[i]>k){
            keys[i+1]=keys[i];
            i--;
        }
        keys[i+1]=k;
        n++;
    }
};

int main(){
    BTreeNode node(3, true);
    node.insert(10);
    node.insert(20);
    node.insert(5);
    node.n=3;
    cout<<"Keys in BTree Node = ";
    node.print();
}