#ifndef MAINWINDOW_H
#define MAINWINDOW_H

#include <QMainWindow>
#include "despesa.h"
#include "despesaTemporaria.h"
#include "despesaVariavel.h"
#include "controle.h"
#include "client.h"
#include "expenserowmodel.h"

QT_BEGIN_NAMESPACE
namespace Ui { class MainWindow; }
QT_END_NAMESPACE

using namespace std;

class MainWindow : public QMainWindow
{
    Q_OBJECT

public:
    Controle expensesControl;
    Client client = Client("Pedro");
    ExpenseRowModel * rowModel;
    MainWindow(QWidget *parent = nullptr);
    ~MainWindow();

private slots:
    void on_pushButton_clicked();

    void on_open_monthly_types_clicked();

    void on_form_dropdown_currentTextChanged(const QString &newValue);

    void on_open_regular_clicked();

    void on_open_investments_clicked();

private:
    Ui::MainWindow *ui;
};
#endif // MAINWINDOW_H
