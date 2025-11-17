#include "monthlytypesdialog.h"
#include "ui_monthlytypesdialog.h"

MonthlyTypesDialog::MonthlyTypesDialog(QWidget *parent, std::vector<std::pair<std::string, float>> * data) :
    QDialog(parent),
    ui(new Ui::MonthlyTypesDialog)
{
    ui->setupUi(this);
    std::vector<std::pair<QPen, QBrush>> colorsVector;
    colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkRed, 2), Qt::red)); // investment
    colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkGreen, 2), Qt::green)); // variable
    colorsVector.push_back(std::pair<QPen, QBrush>(QPen(Qt::darkBlue, 2), Qt::blue)); // regular

    QtCharts::QPieSeries *series = new QtCharts::QPieSeries();

       for (size_t i=0; i < data->size(); i++) {
           series->append(QString::fromStdString(data->at(i).first), data->at(i).second);
           series->slices().at(i)->setLabelVisible();
           series->slices().at(i)->setLabel(QString::number(data->at(i).second));
           series->slices().at(i)->setPen(colorsVector.at(i).first);
           series->slices().at(i)->setBrush(colorsVector.at(i).second);
       }  

       QtCharts::QChart *chart = new QtCharts::QChart();
       chart->addSeries(series);

       for (int j=0; j < chart->legend()->markers(series).size(); j++) {
           chart->legend()->markers(series).at(j)->setLabel(QString::fromStdString(data->at(j).first));
      }

       chart->setTitle("Monthly expenses types");
       ui->graphicsView->setRenderHint(QPainter::Antialiasing);
       ui->graphicsView->setChart(chart);

}

MonthlyTypesDialog::~MonthlyTypesDialog()
{
    delete ui;
}
