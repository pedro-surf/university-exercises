#ifndef INVESTMENTSBARCHARTDIALOG_H
#define INVESTMENTSBARCHARTDIALOG_H

#include <QDialog>

namespace Ui {
class InvestmentsBarChartDialog;
}

class InvestmentsBarChartDialog : public QDialog
{
    Q_OBJECT

public:
    explicit InvestmentsBarChartDialog(QWidget *parent = nullptr,  std::vector<std::pair<std::pair<int, int>, std::pair<std::string, float>>> *data = nullptr, float range = 3000, std::pair<int, int> dischargeDate = std::pair<int, int>(12, 2022));
    ~InvestmentsBarChartDialog();

private:
    Ui::InvestmentsBarChartDialog *ui;
};

#endif // INVESTMENTSBARCHARTDIALOG_H
