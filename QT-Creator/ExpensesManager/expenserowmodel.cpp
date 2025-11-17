#include "expenserowmodel.h"

ExpenseRowModel::ExpenseRowModel(QObject *parent)
    : QAbstractTableModel(parent)
{

}

void ExpenseRowModel::populateData(vector<Despesa*> data) {
     m_data = data;
}

QVariant ExpenseRowModel::headerData(int section, Qt::Orientation orientation, int role) const
{
    if (role == Qt::DisplayRole && orientation == Qt::Horizontal) {
            if (section == 0) {
                return QString("#");
            } else if (section == 1) {
                return QString("Type");
            } else if (section == 2) {
                return QString("Value");
            } else if (section == 3) {
                return QString("Description");
            }
    }
    return QVariant();
}

int ExpenseRowModel::rowCount(const QModelIndex &parent) const
{
    if (parent.isValid())
        return 0;

    return this->m_data.size();
}

int ExpenseRowModel::columnCount(const QModelIndex &parent) const
{
    if (parent.isValid())
        return 0;

    return 4;
}

QVariant ExpenseRowModel::data(const QModelIndex &index, int role) const
{
    if (!index.isValid() || role != Qt::DisplayRole) {
        return QVariant();
    }

    if (m_data.size() > 0) {
        if (index.column() == 0) {
            return index.row();
            } else if (index.column() == 1) {
            return QString::fromStdString(m_data.at(index.row())->GetType());
            } else if (index.column() == 2) {
            return m_data.at(index.row())->GetValue();
            } else if (index.column() == 3) {
            return QString::fromStdString(m_data.at(index.row())->GetDescription());
            }
    }
    return QVariant();
}
