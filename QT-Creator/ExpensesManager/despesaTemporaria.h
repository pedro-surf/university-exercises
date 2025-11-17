#ifndef DESPESATEMPORARIA_H
#define DESPESATEMPORARIA_H

#include "despesa.h"

class DespesaTemporaria : public Despesa
{
protected:
    float m_expire_month;
    float m_expire_year;

public:
    DespesaTemporaria(
        Client *client,
        int month,
        int year,
        int expireMonth,
        int expireYear,
        float val = 0,
        string descr = "") : Despesa(client, month, year, val, descr),
                             m_expire_month(expireMonth),
                             m_expire_year(expireYear){};

    string GetType();
    string GetFullInfo();
    bool Sacar(float value);
    bool operator-=(float value);
    pair<int, int> GetExpirationDate();
    ~DespesaTemporaria(){};
};

#endif // DESPESATEMPORARIA_H
