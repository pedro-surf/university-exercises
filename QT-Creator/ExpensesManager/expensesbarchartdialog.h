#ifndef EXPENSESBARCHARTDIALOG_H
#define EXPENSESBARCHARTDIALOG_H

#include <QDialog>

namespace Ui {
class ExpensesBarChartDialog;
}

class ExpensesBarChartDialog : public QDialog
{
    Q_OBJECT

public:
    explicit ExpensesBarChartDialog(QWidget *parent = nullptr,  std::vector<std::pair<std::string, float>> *data = nullptr, float range = 3000);
    ~ExpensesBarChartDialog();

private:
    Ui::ExpensesBarChartDialog *ui;
};

#endif // EXPENSESBARCHARTDIALOG_H
