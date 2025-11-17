#include "mainwindow.h"

#include <QApplication>

#include "despesa.h"
#include "despesaTemporaria.h"
#include "despesaVariavel.h"
#include "controle.h"
#include "client.h"
#include <vector>
#include <iostream>
#include <map>
#include <fstream>

using namespace std;

int main(int argc, char *argv[])
{
    QApplication a(argc, argv);
    MainWindow w;
    w.show();
    return a.exec();
}
