#ifndef CONTROLE_H
#define CONTROLE_H
#include "despesa.h"
#include "despesaTemporaria.h"
#include "despesaVariavel.h"
#include <vector>

class Controle
{
public:
    vector<Despesa *> m_despesas;
    float GetTotal();
    float GetCount();
    vector<pair<string, float>> GetMonthlyTypesDistribution();
    float GetMostExpensive();
    pair<int, int> GetDischargeDate();
    vector<pair<pair<int, int>, pair<string, float>>> GetDateDistribution();
    void AddExpense(Despesa* expense);
    bool SaveExpenses();
    void LoadExpenses(Client client);
    ~Controle(){
        SaveExpenses();
    };
};

#endif // CONTROLE_H
