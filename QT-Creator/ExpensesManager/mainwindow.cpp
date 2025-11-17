#include "mainwindow.h"
#include "ui_mainwindow.h"
#include <iostream>
#include <fstream>
#include <QDateTime>
#include <QInputDialog>
#include "monthlytypesdialog.h"
#include "expensesbarchartdialog.h"
#include "investmentsbarchartdialog.h"

using namespace std;

MainWindow::MainWindow(QWidget *parent)
    : QMainWindow(parent)
    , ui(new Ui::MainWindow)
{
    ui->setupUi(this);
    // load data
    expensesControl.LoadExpenses(client);
    ui->total_expenses->setText(QString::number(expensesControl.GetCount()));
    ui->total_expenses_2->setText("R$ " + QString::number(expensesControl.GetTotal()));
    // setup table
    ExpenseRowModel * rowModel = new ExpenseRowModel(this);
    rowModel->populateData(expensesControl.m_despesas);
    ui->tableView->setModel(rowModel);
    ui->tableView->setEditTriggers(QAbstractItemView::NoEditTriggers);
    ui->tableView->horizontalHeader()->setVisible(true);

    // hide extra form fields
    ui->label_expiresIn->hide();
    ui->form_minOrMonth->hide();
    ui->form_maxOrYear->hide();
    ui->label_minValueOrMonth->hide();
    ui->label_maxValueOrYear->hide();
}

MainWindow::~MainWindow()
{
    delete ui;
}


void MainWindow::on_pushButton_clicked()
{
    string const description = ui->form_desc->text().toStdString();
    float const value = ui->form_value->text().toFloat();
    string const type = ui->form_dropdown->currentText().toStdString();
    int const month = QDate::currentDate().month();
    int const year = QDate::currentDate().year();
    Despesa * newExpense;

    if (type == "Variable") {
        int minValue = ui->form_minOrMonth->text().toInt();
        int maxValue =  ui->form_maxOrYear->text().toInt();
        newExpense = new DespesaVariavel(
             &client,
             month,
             year,
             minValue,
             maxValue,
             description);
    } else if (type == "Regular") {
        newExpense = new Despesa(
             &client,
             month,
             year,
             value,
             description);
   } else {
        // Investment
        int expireMonth = ui->form_minOrMonth->text().toInt();
        int expireYr =  ui->form_maxOrYear->text().toInt();
        newExpense = new DespesaTemporaria(
             &client,
             month,
             year,
             expireMonth,
             expireYr,
             value,
             description);
    }
    expensesControl.AddExpense(newExpense);
    // reset form
    ui->form_desc->setText("");
    ui->form_value->setText("");
    ui->form_maxOrYear->setText("");
    ui->form_minOrMonth->setText("");
    ui->form_dropdown->setCurrentText("Regular");
    // update counter fields
    ui->total_expenses->setText(QString::number(expensesControl.GetCount()));
    ui->total_expenses_2->setText("R$ " + QString::number(expensesControl.GetTotal()));
    // add to table
    ExpenseRowModel * rowModel = new ExpenseRowModel(this);
    rowModel->populateData(expensesControl.m_despesas);
    ui->tableView->setModel(rowModel);
}



void MainWindow::on_open_monthly_types_clicked()
{
  vector<pair<string, float>> data = expensesControl.GetMonthlyTypesDistribution();
  MonthlyTypesDialog typesChart(nullptr, &data);
  typesChart.setModal(true);
  typesChart.exec();
}


void MainWindow::on_form_dropdown_currentTextChanged(const QString &newValue)
{
   if (newValue == "Variable") {
       ui->label_value->hide();
       ui->form_value->hide();
       ui->label_expiresIn->hide();
       ui->label_minValueOrMonth->setText("Min Value");
       ui->label_maxValueOrYear->setText("Max Value");
       ui->form_minOrMonth->show();
       ui->form_maxOrYear->show();
       ui->label_minValueOrMonth->show();
       ui->label_maxValueOrYear->show();
   }
   else if (newValue == "Investment") {
       ui->label_value->show();
       ui->form_value->show();
       ui->label_expiresIn->show();
       ui->label_minValueOrMonth->setText("Month");
       ui->label_maxValueOrYear->setText("Year");
       ui->form_minOrMonth->show();
       ui->form_maxOrYear->show();
       ui->label_minValueOrMonth->show();
       ui->label_maxValueOrYear->show();
   } else if (newValue == "Regular") {
       ui->label_value->show();
       ui->form_value->show();
       ui->label_expiresIn->hide();
       ui->form_minOrMonth->hide();
       ui->form_maxOrYear->hide();
       ui->label_minValueOrMonth->hide();
       ui->label_maxValueOrYear->hide();
   }
}


void MainWindow::on_open_regular_clicked()
{
    vector<pair<string, float>> data;
    for (size_t i = 0; i < expensesControl.m_despesas.size(); i++) {
        float value = expensesControl.m_despesas.at(i)->GetValue();
        string title = expensesControl.m_despesas.at(i)->GetDescription();
        data.push_back(pair<string, float>(title, value));
    }
    ExpensesBarChartDialog regularChart(nullptr, &data, expensesControl.GetMostExpensive());
    regularChart.setModal(true);
    regularChart.exec();
}


void MainWindow::on_open_investments_clicked()
{
    vector<pair<pair<int, int>, pair<string, float>>> dateDistrib = expensesControl.GetDateDistribution();
    InvestmentsBarChartDialog chart(nullptr, &dateDistrib, expensesControl.GetMostExpensive(), expensesControl.GetDischargeDate());
    chart.setModal(true);
    chart.exec();
}

