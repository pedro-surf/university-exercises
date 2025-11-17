#include "expensesbarchartdialog.h"
#include "ui_expensesbarchartdialog.h"

ExpensesBarChartDialog::ExpensesBarChartDialog(QWidget *parent,   std::vector<std::pair<std::string, float>> *data, float range) :
    QDialog(parent),
    ui(new Ui::ExpensesBarChartDialog)
{
    ui->setupUi(this);
    std::vector<std::pair<QPen, QBrush>> colorsVector;
       colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkRed, 2), Qt::red)); // investment
       colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkGreen, 2), Qt::green)); // variable
       colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkBlue, 2), Qt::blue)); // regular
        QtCharts::QBarSeries *series = new QtCharts::QBarSeries();
        for (size_t i=0; i < data->size(); i++) {
            QtCharts::QBarSet *set = new QtCharts::QBarSet(QString::fromStdString(data->at(i).first));
            *set << data->at(i).second;
            series->append(set);
        }
        QtCharts::QValueAxis *axisY = new QtCharts::QValueAxis();
         axisY->setRange(0, range);

        QtCharts::QChart *chart = new QtCharts::QChart();
        chart->addSeries(series);
        chart->addAxis(axisY, Qt::AlignLeft);
        series->attachAxis(axisY);

        chart->setTitle("Current expenses");
        chart->setAnimationOptions(QChart::SeriesAnimations);
        ui->graphicsView->setRenderHint(QPainter::Antialiasing);
        ui->graphicsView->setChart(chart);
}

ExpensesBarChartDialog::~ExpensesBarChartDialog()
{
    delete ui;
}
