#include <iostream>
#include <vector>
#include <string>
#include <queue>
#include <stack>
#include <algorithm>
#include <ctime>
#include <climits>
using namespace std;

struct User{
    int id;
    string name;
    string dob;
    int comments;
};

class Graph{
    public:
        vector<User> users;
        vector<vector<int>> adj;
        Graph(int n){
            adj.resize(n);
        }
        void addUser(int id, string name, string dob, int comments){
            User u = {id, name, dob, comments};
            users.push_back(u);
            adj.push_back({});
        }
        void addFriend(int u, int v){
            adj[u].push_back(v);
            adj[v].push_back(u);
        }
        void maxFrnds(){
            int mf=0;
            int uid=-1;
            for(int i=0;i<users.size();i++){
                if(adj[i].size()>mf){
                    mf=adj[i].size();
                    uid=i;
                }
            }
            if(uid!=-1){
                cout<<"User with max frnds: "<<users[uid].name<<" with "<<mf<<" frnds."<<endl;
            }
        }
        void bday(){
            time_t now = time(0);
            tm *a = localtime(&now);
            int m = a->tm_mon + 1;
            bool found = false;
            for(User u : users){
                string dob = u.dob;
                int mm = stoi(dob.substr(3,2));
                if(mm == m){
                    cout<<u.name<<"'s Birthday this month"<<endl;
                    found = true;
                }
            }
            if(!found){
                cout << "No Birthdays this month" << endl;
            }
        }
        void minCmnts(){
            int minC = INT_MAX;
            int uid = -1;
            for(int i=0;i<users.size();i++){
                if(users[i].comments<minC){
                    minC=users[i].comments;
                    uid=i;
                }
            }
            if(uid!=-1){
                cout<<"User with min comments: "<<users[uid].name<<" with "<<minC<<" comments."<<endl;
            }
        }
        void maxCmnts(){
            int maxC = INT_MIN;
            int uid = -1;
            for(int i=0;i<users.size();i++){
                if(users[i].comments>maxC){
                    maxC=users[i].comments;
                    uid=i;
                }
            }
            if(uid!=-1){
                cout<<"User with max comments: "<<users[uid].name<<" with "<<maxC<<" comments."<<endl;
            }
        }
};

void dfs(int start, vector<bool>& visited, Graph& g){
    visited[start]=true;
    cout<<"Visited user: "<<g.users[start].name<<endl;
    for(int a:g.adj[start]){
        if(!visited[a]){
            dfs(a, visited, g);
        }
    }
}

void bfs(int start, Graph& g){
    vector<bool> visited(g.users.size(),false);
    queue<int> q;
    q.push(start);
    visited[start]=true;
    while(!q.empty()){
        int u=q.front();
        q.pop();
        cout<<"Visited user: "<<g.users[u].name<<endl;
        for(int a:g.adj[u]){
            if(!visited[a]){
                visited[a]=true;
                q.push(a);
            }
        }
    }
}

int main(){
    Graph g(5);
    g.addUser(0, "Apurv", "28/06/2006", 10);
    g.addUser(1, "Pranet", "17/02/2006", 12);
    g.addUser(2, "Shantanu", "28/06/2006", 8);
    g.addUser(3, "XYZ", "15/08/2006", 5);
    g.addUser(4, "ABC", "01/01/2006", 8);
    g.addUser(5, "PQR", "10/03/2006", 15);

    g.addFriend(0, 1);
    g.addFriend(1, 2);
    g.addFriend(2, 3);
    g.addFriend(3, 4);
    g.addFriend(4, 5);
    g.addFriend(0, 5);
    g.addFriend(0, 3);
    g.addFriend(2, 4);
    g.addFriend(0, 2);

    int choice;
    bool b = true;

    while(b){
        cout << "\nSocial Media of VIT" << endl;
        cout << "1. DFS Traversal" << endl;
        cout << "2. BFS Traversal" << endl;
        cout << "3. Max Friends" << endl;
        cout << "4. Birthday Check" << endl;
        cout << "5. Min Comments" << endl;
        cout << "6. Max Comments" << endl;
        cout << "7. Exit" << endl;
        cout << "Enter your choice: ";
        cin >> choice;

        switch(choice){
            case 1: {
                cout << "\nDFS Traversal" << endl;
                vector<bool> visited(g.users.size(), false);
                dfs(0, visited, g);
                break;
            }
            case 2: {
                cout << "\nBFS Traversal" << endl;
                bfs(0, g);
                break;
            }
            case 3: {
                g.maxFrnds();
                break;
            }
            case 4: {
                g.bday();
                break;
            }
            case 5: {
                g.minCmnts();
                break;
            }
            case 6: {
                g.maxCmnts();
                break;
            }
            case 7: {
                cout << "Bye Bye" << endl;
                b = false;
                break;
            }
            default:
                cout << "Invalid choice!" << endl;
        }
    }

    return 0;
}