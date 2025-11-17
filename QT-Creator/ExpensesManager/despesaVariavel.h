#ifndef DESPESAVARIAVEL_H
#define DESPESAVARIAVEL_H

#include "despesa.h"

class DespesaVariavel : public Despesa
{
protected:
    float m_valor_min;
    float m_valor_max;

public:
    DespesaVariavel(
        Client *client,
        int month,
        int year,
        int min,
        int max,
        string descr = "") : Despesa(client, month, year, (min + max) / 2, descr),
                             m_valor_min(min),
                             m_valor_max(max){};
    string GetType();
    ~DespesaVariavel(){};
};

#endif // DESPESAVARIAVEL_H
