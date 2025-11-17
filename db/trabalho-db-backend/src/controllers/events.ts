import express from "express";
import { Evento } from "../entities/Evento";
import { Op } from "sequelize";
import { sequelize } from "../database";
import { InscricaoEvento } from "../entities/InscricaoEvento";
import { Usuario } from "../entities/Usuario";
import { authenticate } from "../middleware/authenticate";
import checkLocalReservations from "../middleware/checkLocalReservations";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const events = await Evento.findAll({
      where: req.query,
      include: ["local", "inscricoes"],
      attributes: [
        "evento_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Evento.evento_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoEvento.evento_id",
        "inscricoes->InscricaoEvento.usuario_id",
        "inscricoes->InscricaoEvento.inscricao_evento_id",
      ],
    });
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar eventos" });
  }
});

router.get("/subscribed", async (req, res) => {
  try {
    const events = await Evento.findAll({
      include: [
        "local",
        {
          as: "inscricoes",
          model: Usuario,
          where: {
            usuario_id: {
              // @ts-ignore
              [Op.eq]: req.user.usuario_id,
            },
          },
        },
      ],
      attributes: [
        "evento_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Evento.evento_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoEvento.evento_id",
        "inscricoes->InscricaoEvento.usuario_id",
        "inscricoes->InscricaoEvento.inscricao_evento_id",
      ],
      where: {
        // count: { [Op.lt]: "$local.capacidade$" },
      },
    });
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Evento" });
  }
});

router.get("/available", async (req, res) => {
  try {
    const events = await Evento.findAll({
      include: [
        "local",
        {
          as: "inscricoes",
          model: Usuario,
          where: {
            usuario_id: {
              // @ts-ignore
              [Op.eq]: req.user.usuario_id,
            },
          },
          required: false,
        },
      ],
      attributes: [
        "evento_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Evento.evento_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoEvento.evento_id",
        "inscricoes->InscricaoEvento.usuario_id",
        "inscricoes->InscricaoEvento.inscricao_evento_id",
      ],
      where: {
        "$inscricoes.usuario_id$": { [Op.is]: null },
      },
    });
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Eventos" });
  }
});

router.get("/:id/subscriptions", async (req, res) => {
  try {
    const events = await Evento.findAll({
      where: {
        eventoId: req.params.id,
      },
      include: ["subscriptions"],
      attributes: [
        "eventoId",
        [sequelize.fn("COUNT", sequelize.col("subscriptions.id")), "count"],
      ],
      group: ["Evento.eventoId", "subscriptions.eventoId"],
    });
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projeto" });
  }
});

router.get("/subscriptions", async (_req, res) => {
  try {
    const events = await Evento.findAll({
      include: ["presence"],
      attributes: [
        "eventoId",
        [sequelize.fn("COUNT", sequelize.col("Evento.eventoId")), "count"],
      ],
      group: ["Evento.eventoId", "presence.eventoId", ],
    });
    res.json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Evento" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newEvento = {
      ...req.body,
      // @ts-ignore
      professor_id: req.user.usuario_id,
    };
    if (req.body.local_id) {
      await checkLocalReservations({ ...req.body });
    }

    // Create a new user using Sequelize model
    const events = await Evento.create(newEvento);
    res.status(201).json({ events });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: `Erro ao criar evento: ${error}` });
  }
});

router.post("/:id/subscription", async (req, res) => {
  try {
    const newSubscription = {
      evento_id: req.params.id,
      // @ts-ignore
      usuario_id: req.user.usuario_id,
    };
    await InscricaoEvento.create(newSubscription);
    res.status(201).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao realizar inscrição" });
  }
});

router.post("/:id/unsubscribe", async (req, res) => {
  try {
    const subscription = await InscricaoEvento.findOne({
      where: {
        evento_id: req.params.id,
        // @ts-ignore
        usuario_id: req.user.usuario_id,
      },
    });
    if (!subscription) {
      return res.status(400).json({ error: "Inscrição não encontrada" });
    }
    await subscription.destroy();
    res.status(201).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao realizar inscrição" });
  }
});

export default router;
