import express from "express";
import { Op } from "sequelize";
import { sequelize } from "../database";
import { InscricaoCurso } from "../entities/InscricaoCurso"; 
import { Curso } from "../entities/Curso"; 
import { Usuario } from "../entities/Usuario";
import { authenticate } from "../middleware/authenticate";
import checkLocalReservations from "../middleware/checkLocalReservations";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const courses = await Curso.findAll({
      where: req.query,
      include: ["local", "inscricoes"],
      attributes: [
        "curso_id",
        "title",
        "description",
        "start_at",
        "end_at",
        "credit_hours",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Curso.curso_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoCurso.curso_id",
        "inscricoes->InscricaoCurso.usuario_id",
        "inscricoes->InscricaoCurso.inscricao_curso_id",
      ],
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Cursos" });
  }
});

router.get("/subscribed", async (req, res) => {
  try {
    const courses = await Curso.findAll({
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
        "curso_id",
        "title",
        "description",
        "start_at",
        "end_at",
        "credit_hours",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Curso.curso_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoCurso.curso_id",
        "inscricoes->InscricaoCurso.usuario_id",
        "inscricoes->InscricaoCurso.inscricao_curso_id",
      ],
      where: {
        // count: { [Op.lt]: "$local.capacidade$" },
      },
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Cursos" });
  }
});

router.get("/available", async (req, res) => {
  try {
    const courses = await Curso.findAll({
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
        "curso_id",
        "title",
        "credit_hours",
        "description",
        "start_at",
        "end_at",
        [sequelize.fn("COUNT", sequelize.col("inscricoes")), "count"],
      ],
      group: [
        "Curso.curso_id",
        "local.local_id",
        "inscricoes.usuario_id",
        "inscricoes->InscricaoCurso.curso_id",
        "inscricoes->InscricaoCurso.usuario_id",
        "inscricoes->InscricaoCurso.inscricao_curso_id",
      ],
      where: {
        "$inscricoes.usuario_id$": { [Op.is]: null },
      },
    });
    res.json({ courses });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Cursos" });
  }
});

router.get("/:id/subscriptions", async (req, res) => {
  try {
    const course = await Curso.findAll({
      where: {
        cursoId: req.params.id,
      },
      include: ["subscriptions"],
      attributes: [
        "cursoId",
        [sequelize.fn("COUNT", sequelize.col("subscriptions.id")), "count"],
      ],
      group: ["Curso.cursoId", "subscriptions.cursoId"],
    });
    res.json({ course});
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Curso" });
  }
});

router.get("/subscriptions", async (_req, res) => {
  try {
    const course = await Curso.findAll({
      include: ["presence"],
      attributes: [
        "cursoId",
        [sequelize.fn("COUNT", sequelize.col("Curso.cursoId")), "count"],
      ],
      group: ["Curso.cursoId", "presence.cursoId"],
    });
    res.json({ course });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar Curso" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newCourse = {
      ...req.body,
      // @ts-ignore
      professor_id: req.user.usuario_id,
    };
    if (req.body.local_id) {
        await checkLocalReservations({ ...req.body });
    }

    // Create a new user using Sequelize model
    const project = await Curso.create(newCourse);
    res.status(201).json({ project });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar curso" });
  }
});

router.post("/:id/subscription", async (req, res) => {
  try {
    const newSubscription = {
      curso_id: req.params.id,
      // @ts-ignore
      usuario_id: req.user.usuario_id,
    };
    await InscricaoCurso.create(newSubscription);
    res.status(201).json({ message: "Inscrição realizada com sucesso" });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao realizar inscrição" });
  }
});

router.post("/:id/unsubscribe", async (req, res) => {
  try {
    const subscription = await InscricaoCurso.findOne({
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
