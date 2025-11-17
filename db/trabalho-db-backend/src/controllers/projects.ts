import express from "express";
import { Op } from "sequelize";
import { sequelize } from "../database";
import { InscricaoProjeto } from "../entities/InscricaoProjeto";
import { Projeto } from "../entities/Projeto";
import { Usuario } from "../entities/Usuario";
import { authenticate } from "../middleware/authenticate";
import checkLocalReservations from "../middleware/checkLocalReservations";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const courses = await Projeto.findAll({
      where: req.query,
      include: ["local", "inscricoes"],
      attributes: [
        "projeto_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Projeto.projeto_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoProjeto.projeto_id",
        "inscricoes->InscricaoProjeto.usuario_id",
        "inscricoes->InscricaoProjeto.inscricao_projeto_id",
      ],
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projetos" });
  }
});

router.get("/subscribed", async (req, res) => {
  try {
    const courses = await Projeto.findAll({
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
        "projeto_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Projeto.projeto_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoProjeto.projeto_id",
        "inscricoes->InscricaoProjeto.usuario_id",
        "inscricoes->InscricaoProjeto.inscricao_projeto_id",
      ],
      where: {
        // count: { [Op.lt]: "$local.capacidade$" },
      },
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projetos" });
  }
});

router.get("/available", async (req, res) => {
  try {
    const courses = await Projeto.findAll({
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
        "projeto_id",
        "title",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Projeto.projeto_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoProjeto.projeto_id",
        "inscricoes->InscricaoProjeto.usuario_id",
        "inscricoes->InscricaoProjeto.inscricao_projeto_id",
      ],
      where: {
        "$inscricoes.usuario_id$": { [Op.is]: null },
      },
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projetos" });
  }
});

router.get("/:id/subscriptions", async (req, res) => {
  try {
    const project = await Projeto.findAll({
      where: {
        projetoId: req.params.id,
      },
      include: ["subscriptions"],
      attributes: [
        "projetoId",
        [sequelize.fn("COUNT", sequelize.col("subscriptions.id")), "count"],
      ],
      group: ["Projeto.projetoId", "subscriptions.projetoId"],
    });
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projeto" });
  }
});

router.get("/subscriptions", async (_req, res) => {
  try {
    const project = await Projeto.findAll({
      include: ["presence"],
      attributes: [
        "projetoId",
        [sequelize.fn("COUNT", sequelize.col("Projeto.projetoId")), "count"],
      ],
      group: ["Projeto.projetoId", "presence.projetoId"],
    });
    res.json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Projeto" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newProject = {
      ...req.body,
      // @ts-ignore
      professor_id: req.user.usuario_id,
    };
    if (req.body.local_id) {
      await checkLocalReservations({ ...req.body });
    }

    // Create a new user using Sequelize model
    const project = await Projeto.create(newProject);
    res.status(201).json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar projeto" });
  }
});

router.post("/:id/subscription", async (req, res) => {
  try {
    const newSubscription = {
      projeto_id: req.params.id,
      // @ts-ignore
      usuario_id: req.user.usuario_id,
    };
    await InscricaoProjeto.create(newSubscription);
    res.status(201).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao realizar inscrição" });
  }
});

router.post("/:id/unsubscribe", async (req, res) => {
  try {
    const subscription = await InscricaoProjeto.findOne({
      where: {
        projeto_id: req.params.id,
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
