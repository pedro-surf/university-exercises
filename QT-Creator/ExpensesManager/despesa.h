#ifndef DESPESA_H
#define DESPESA_H
#include "client.h"
#include <iostream>

using namespace std;

class Despesa
{
protected:
    Client *m_client;
    float m_valor;
    int m_creation_month;
    int m_creation_year;
    string m_descr;
    static const inline string fieldDivider = "-";

public:
    Despesa() : m_client(NULL), m_valor(0){};
    Despesa(
        Client *client,
        int creationMonth,
        int creationYear,
        float valor = 0,
        string desc = "") : m_client(client),
                            m_valor(valor),
                            m_creation_month(creationMonth),
                            m_creation_year(creationYear),
                            m_descr(desc){};
    virtual string GetType();
    virtual string GetFullInfo();
    virtual  pair<int, int> GetExpirationDate();
    float GetValue();
    string GetDescription();
    bool Acumular(float value);
    bool operator+=(float value);
    ~Despesa(){};
};

#endif // DESPESA_H
