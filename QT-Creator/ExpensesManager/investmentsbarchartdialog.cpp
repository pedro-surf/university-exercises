#include "investmentsbarchartdialog.h"
#include "ui_investmentsbarchartdialog.h"
#include <iostream>

InvestmentsBarChartDialog::InvestmentsBarChartDialog(QWidget *parent,   std::vector<std::pair<std::pair<int, int>, std::pair<std::string, float>>> *data, float range, std::pair<int, int> dischargeDate) :
    QDialog(parent),
    ui(new Ui::InvestmentsBarChartDialog)
{
    ui->setupUi(this);
        QtCharts::QBarSeries *series = new QtCharts::QBarSeries();
        QStringList categories;
        QStringList months{"Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dez"};
        int const currentMonth = QDate::currentDate().month();
        int const currentYear = QDate::currentDate().year();
        // add current year months
        for (int m = currentMonth; m <= 12; m++) {
            categories << months.at(m-1);
        }
        // add future year months
        int y = currentYear+1;
        while (y < dischargeDate.second) {
            for (int m = 1; m <= 12; m++) {
                QString category = months.at(m-1);
                category += "/";
                category += QString::number(y);
                categories << category;
            }
             y++;
        }
        // add discharge year months
        if (y == dischargeDate.second) {
            for (int m = 1; m < dischargeDate.first; m++) {
                    QString category = months.at(m-1);
                    category += "/";
                    category += QString::fromStdString(std::to_string(dischargeDate.second));
                    categories << category;
            }
        }


        for (size_t i=0; i < data->size(); i++) {
            QString setName = QString::fromStdString(data->at(i).second.first);

            QtCharts::QBarSet *set = new QtCharts::QBarSet(setName);
                // toDo add for every month
            int yr = currentYear;
            int mon = currentMonth;
            while (yr < data->at(i).first.second) {
                while (mon <= 12) {
                    *set << data->at(i).second.second;
                    mon++;
                }
                yr++;
            }
            if (yr == data->at(i).first.second) {
                if (yr != currentYear) {
                mon = 1;
                } else mon = currentMonth;
                while (mon <= data->at(i).first.first) {
                    *set << data->at(i).second.second;
                    mon++;
                }
            }
            series->append(set);
        }
        QBarCategoryAxis *axisX = new QBarCategoryAxis();
        axisX->append(categories);
        QtCharts::QValueAxis *axisY = new QtCharts::QValueAxis();
         axisY->setRange(0, range);

        QtCharts::QChart *chart = new QtCharts::QChart();
        chart->addSeries(series);
        chart->addAxis(axisX, Qt::AlignBottom);
        chart->addAxis(axisY, Qt::AlignLeft);
        series->attachAxis(axisX);
        series->attachAxis(axisY);
        std::string title = std::to_string(dischargeDate.first);
        title += "/";
        title += std::to_string(dischargeDate.second);
        title += " - Investments calendar";
        chart->setTitle(QString::fromStdString(title));
        chart->setAnimationOptions(QChart::SeriesAnimations);
        ui->graphicsView->setRenderHint(QPainter::Antialiasing);
        ui->graphicsView->setChart(chart);
}

InvestmentsBarChartDialog::~InvestmentsBarChartDialog()
{
    delete ui;
}
