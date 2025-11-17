#ifndef EXPENSEROWMODEL_H
#define EXPENSEROWMODEL_H

#include <QAbstractTableModel>
#include "despesa.h"

class ExpenseRowModel : public QAbstractTableModel
{
    Q_OBJECT

public:
    explicit ExpenseRowModel(QObject *parent = nullptr);
    vector<Despesa*> m_data;
    void populateData(vector<Despesa*> data);
    // Header:
    QVariant headerData(int section, Qt::Orientation orientation, int role = Qt::DisplayRole) const override;

    // Basic functionality:
    int rowCount(const QModelIndex &parent = QModelIndex()) const override;
    int columnCount(const QModelIndex &parent = QModelIndex()) const override;

    QVariant data(const QModelIndex &index, int role = Qt::DisplayRole) const override;

private:
};

#endif // EXPENSEROWMODEL_H
