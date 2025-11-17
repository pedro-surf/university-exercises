QT       += core gui charts

greaterThan(QT_MAJOR_VERSION, 4): QT += widgets

CONFIG += c++17

# You can make your code fail to compile if it uses deprecated APIs.
# In order to do so, uncomment the following line.
#DEFINES += QT_DISABLE_DEPRECATED_BEFORE=0x060000    # disables all the APIs deprecated before Qt 6.0.0

SOURCES += \
    client.cpp \
    controle.cpp \
    despesa.cpp \
    despesaTemporaria.cpp \
    despesaVariavel.cpp \
    expenserowmodel.cpp \
    expensesbarchartdialog.cpp \
    investmentsbarchartdialog.cpp \
    main.cpp \
    mainwindow.cpp \
    monthlytypesdialog.cpp

HEADERS += \
    client.h \
    controle.h \
    despesa.h \
    despesaTemporaria.h \
    despesaVariavel.h \
    expenserowmodel.h \
    expensesbarchartdialog.h \
    investmentsbarchartdialog.h \
    mainwindow.h \
    monthlytypesdialog.h

FORMS += \
    expensesbarchartdialog.ui \
    investmentsbarchartdialog.ui \
    mainwindow.ui \
    monthlytypesdialog.ui

# Default rules for deployment.
qnx: target.path = /tmp/$${TARGET}/bin
else: unix:!android: target.path = /opt/$${TARGET}/bin
!isEmpty(target.path): INSTALLS += target
