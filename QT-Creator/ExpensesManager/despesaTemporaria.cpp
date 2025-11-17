#include "despesaTemporaria.h"

string DespesaTemporaria::GetType()
{
    return "Investment";
}

pair<int, int> DespesaTemporaria::GetExpirationDate()
{
    return pair<int, int>(this->m_expire_month, this->m_expire_year);
}


string DespesaTemporaria::GetFullInfo()
{
    string info = this->GetType();
    info += this->fieldDivider;
    info += to_string((int)this->GetValue());
    info += this->fieldDivider;
    info += this->m_descr;
    info += this->fieldDivider;
    info += to_string((int)this->m_expire_month);
    info += this->fieldDivider;
    info += to_string((int)this->m_expire_year);
    return info;
}
