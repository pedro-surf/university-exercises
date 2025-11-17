#ifndef CLIENT_H
#define CLIENT_H
#include <iostream>
using namespace std;

class Client
{
public:
    std::string nome;
    Client() : nome("") {};
    Client(string name) : nome(name) {};
    string getName();
    ~Client(){};
};

#endif // CLIENT_H
