#include "despesa.h"

string Despesa::GetType()
{
    return "Regular";
}

string Despesa::GetFullInfo()
{
    string info = this->GetType();
    info += this->fieldDivider;
    info += to_string((int)this->GetValue());
    info += this->fieldDivider;
    info += this->m_descr;
    return info;
}

float Despesa::GetValue()
{
    return m_valor;
}

string Despesa::GetDescription()
{
    return m_descr;
}

bool Despesa::Acumular(float value)
{
    m_valor += value;
    return true;
}

bool Despesa::operator+=(float value)
{
    return Acumular(value);
}

pair<int, int> Despesa::GetExpirationDate()
{
 return pair<int, int>(this->m_creation_month, this->m_creation_year);
 }
