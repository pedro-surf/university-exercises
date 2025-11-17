#include <QGraphicsRectItem>
#include <QTimer>
#include <QDebug>

#include "bullet.h"
#include "game.h"

// declaração da variavel do tipo extern
// indica que essa variavel já foi declarada em algum outro arquivo do projeto
extern Game * game;

Bullet::Bullet(QGraphicsItem *parent) : QObject(), QGraphicsRectItem(parent)
{
    // desenhar o tiro
    setRect(0,0,10,50);
    // conectar o timer com o movimento
    QTimer * timer = new QTimer();
    connect(timer,SIGNAL(timeout()),this,SLOT(move()));
    // inicializar o timer
    timer->start(50);
}

void Bullet::move()
{
    // movimentação do tiro
    setPos(x(),y()-10);
    if(pos().y() < -10)
        {
        scene()->removeItem(this);
        delete this;
        qDebug()<<"Bullet removed";
        }
}
