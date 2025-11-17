#include "controle.h"
#include <QFile>
#include <QTextStream>
#include <QMessageBox>
#include <QDateTime>
#include <iostream>

using namespace std;

float Controle::GetTotal() {
    float sum = 0;
    for (size_t i = 0; i < m_despesas.size(); i++) {
        sum += m_despesas.at(i)->GetValue();
    }
    return sum;
}

float Controle::GetCount() {
    return m_despesas.size();
}

void Controle::AddExpense(Despesa* expense) {
    m_despesas.push_back(expense);
}

vector<pair<string, float>> Controle::GetMonthlyTypesDistribution() {
    float investmentTotal = 0;
    float variableTotal = 0;
    float regularTotal = 0;
    vector<pair<string, float>> data;
    for (size_t i=0; i<m_despesas.size(); i++) {
        if (m_despesas.at(i)->GetType() == "Investment") {
            investmentTotal += m_despesas.at(i)->GetValue();
        }
        if (m_despesas.at(i)->GetType() == "Variable") {
            variableTotal += m_despesas.at(i)->GetValue();
        }
        if (m_despesas.at(i)->GetType() == "Regular") {
            regularTotal += m_despesas.at(i)->GetValue();
        }
    }
    data.push_back(pair<string, float>("Investment", investmentTotal));
    data.push_back(pair<string, float>("Variable", variableTotal));
    data.push_back(pair<string, float>("Regular", regularTotal));
    return data;
}

vector<pair<pair<int, int>, pair<string, float>>> Controle::GetDateDistribution() {
    vector<pair<pair<int, int>, pair<string, float>>> data;
    for (size_t i = 0; i < m_despesas.size(); i++) {
            if (m_despesas.at(i)->GetType() == "Investment") {
                   pair<int, int> recordExpires = m_despesas.at(i)->GetExpirationDate();
                   string desc = m_despesas.at(i)->GetDescription();
                   float val = m_despesas.at(i)->GetValue();
                   data.push_back(pair<pair<int, int>, pair<string, float>>(recordExpires, pair<string, float>(desc, val)));
             }
    }
    return data;
}

float Controle::GetMostExpensive() {
    float mostExpensive = 0;
    for (size_t i = 0; i < m_despesas.size(); i++) {
        if (mostExpensive < m_despesas.at(i)->GetValue()) {
            mostExpensive = m_despesas.at(i)->GetValue();
        }
    }
    return mostExpensive;
}

pair<int, int> Controle::GetDischargeDate() {
    int lastMonth = 1;
    int lastYear = QDate::currentDate().year();
    for (size_t i = 0; i < m_despesas.size(); i++) {
        pair<int, int> recordExpirationDate = m_despesas.at(i)->GetExpirationDate();
        if (lastYear <= recordExpirationDate.second) {
            lastYear = recordExpirationDate.second;
            if (lastMonth < recordExpirationDate.first) {
                lastMonth = recordExpirationDate.first;
            }
        }
    }
    return pair<int, int>(lastMonth, lastYear);
}

bool Controle::SaveExpenses() {
    QFile file("Data.txt");
    if (!file.open(QIODevice::ReadWrite)) {
        return false;
    }
    QTextStream stream(&file);
    for (size_t i=0; i<m_despesas.size(); i++) {
       stream << QString::fromStdString(m_despesas.at(i)->GetFullInfo()) << Qt::endl;
    }
    file.close();
    return true;
}

void Controle::LoadExpenses(Client client) {
    QFile file("Data.txt");
        if(!file.open(QIODevice::ReadOnly)) {
            QMessageBox::information(0, "error", file.errorString());
        }

        QTextStream in(&file);
    int currentYear = QDate::currentDate().year();
        int currentMonth = QDate::currentDate().month();
        while(!in.atEnd()) {
            QString line = in.readLine();
            QStringList fields = line.split("-");
            Despesa * readExpense;
            if (fields.at(0) == "Investment") {
                readExpense = new DespesaTemporaria(
                            &client,
                            currentMonth,
                            currentYear,
                            fields.at(3).toInt(),
                            fields.at(4).toInt(),
                            fields.at(1).toInt(),
                            fields.at(2).toStdString());
            } else if (fields.at(0) == "Regular") {
                readExpense = new Despesa(
                            &client,
                            currentMonth,
                            currentYear,
                            fields.at(1).toInt(),
                            fields.at(2).toStdString());
            } else {
                readExpense = new DespesaVariavel(
                            &client,
                            currentMonth,
                            currentYear,
                            fields.at(1).toInt(),
                            fields.at(1).toInt(),
                            fields.at(2).toStdString());
            }

       this->AddExpense(readExpense);
        }
        file.close();
       {/* string record = "";
        vector<int> tokens;
        size_t position = 0;
        while ((position = record.find(",")) != std::string::npos)
        {
            tokens.push_back(stoi(record.substr(0, position)));
            record.erase(0, position + 1);
        }
        tokens.push_back(stoi(record));
        string type = tokens.at(0);
        if (type == "Investment") {

        } */}
}
