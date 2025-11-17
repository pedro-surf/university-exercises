#include <QGraphicsScene>
#include <QObject>
#include <QGraphicsItem>
#include <QDebug>
#include <QKeyEvent>

#include "player.h"
#include "bullet.h"

Player::Player(QGraphicsItem *parent): QGraphicsRectItem(parent)
{
}

void Player::keyPressEvent(QKeyEvent *event)
{
//mensagem informando que ocorreu uso do teclado
// qDebug()<<"Key press detected";
    if(event->key() == Qt::Key_Left)
    {
    // limite para não sair da tela
    if(pos().x() > 0)
    setPos(x()-10,y());
    }
    else if(event->key() == Qt::Key_Right)
    {
    // limite para não sair da tela
    if(pos().x() + 100 < 800 )
    setPos(x()+10,y());
    }
    else if(event->key() == Qt::Key_Up)
    {
    setPos(x(),y()-10);
    }
    else if(event->key() == Qt::Key_Down)
    {
    setPos(x(),y()+10);
    }
    // criar tiro (bullet)
    else if(event->key() == Qt::Key_Space)
    {
    // teste via Debug
    // qDebug()<<"Bullet created";
    Bullet * bullet = new Bullet();
    bullet->setPos(x(),y());
    scene()->addItem(bullet);
    }
    else if(event->key() == Qt::Key_Backspace)
    {
    Bullet * bullet = new Bullet();
    Bullet * bullet2 = new Bullet();

    bullet->setPos(x(),y());
    scene()->addItem(bullet);
    bullet2->setPos(x()+60,y());
    scene()->addItem(bullet2);
    }
}
