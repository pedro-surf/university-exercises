#ifndef MONTHLYTYPESDIALOG_H
#define MONTHLYTYPESDIALOG_H

#include <QDialog>
#include <vector>

namespace Ui {
class MonthlyTypesDialog;
}

class MonthlyTypesDialog : public QDialog
{
    Q_OBJECT

public:
    explicit MonthlyTypesDialog(QWidget *parent = nullptr, std::vector<std::pair<std::string, float>> *data = nullptr);
    ~MonthlyTypesDialog();

private:
    Ui::MonthlyTypesDialog *ui;
};

#endif // MONTHLYTYPESDIALOG_H
