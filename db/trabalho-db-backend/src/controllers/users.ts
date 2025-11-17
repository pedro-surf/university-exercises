import express from "express";
import * as bcrypt from "bcrypt";
import { sequelize } from "../database";
import { Usuario } from "../entities/Usuario"; // Import your Sequelize model

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    // Find all users using Sequelize model
    const users = await Usuario.findAll({ where: req.query });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.get("/estudantes", async (_req, res) => {
  try {
    // Find all users using Sequelize model
    const users = await Usuario.findAll({ where: { role: "estudante" } });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.get("/instructors", async (_req, res) => {
  try {
    // Find all users using Sequelize model
    const users = await Usuario.findAll({ where: { role: "professor" } });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.get("/visitantes", async (_req, res) => {
  try {
    const users = await Usuario.findAll({ where: { role: "visitante" } });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.get("/most-attended", async (_req, res) => {
  try {
    const [users] = await sequelize.query(`
     SELECT
 u.nome,
 u.sobrenome,
 COUNT(pp.*) AS total_presencas
 FROM usuario u
 INNER JOIN projeto p ON u.usuario_id = p.professor_id
 INNER JOIN inscricao_projeto ip ON p.projeto_id = ip.projeto_id
 INNER JOIN presenca_projeto pp on pp.inscricao_projeto_id = ip.inscricao_projeto_id
 WHERE p.created_at >= '2023-01-01'
 GROUP BY u.usuario_id
 ORDER BY total_presencas DESC;
 `);
    // const users = await Usuario.findAll({
    //   include: [
    //     {
    //       model: Projeto,
    //       as: "projetos",
    //       include: [
    //         {
    //           model: InscricaoProjeto,
    //           as: "inscricoes",
    //           attributes: [],
    //           include: ["presenca"],
    //         },
    //       ],
    //     },
    //   ],
    //   attributes: [
    //     "nome",
    //     "sobrenome",
    //     // [
    //     //   sequelize.fn(
    //     //     "COUNT",
    //     //     sequelize.col("projetos.inscricoes.presenca.attended")
    //     //   ),
    //     //   "total_presencas",
    //     // ],
    //   ],
    // });
    res.json({ users });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    // Find user by id using Sequelize model
    const user = await Usuario.findByPk(req.params.id);
    res.json({ user });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar usuário" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newUser = req.body;
    // Create a new user using Sequelize model
    const t = await sequelize.transaction();
    const { password, ...userCriada } = await Usuario.create(
      {
        ...newUser,
        password: await bcrypt.hash(req.body.password || "password", 10),
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.status(201).json(userCriada);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const user = await Usuario.findByPk(req.params.id);
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }
    const t = await sequelize.transaction();
    const { password, ...userAtualizada } = await user.update(
      {
        ...req.body,
        password: await bcrypt.hash(req.body.password || "password", 10),
      },
      {
        transaction: t,
      }
    );
    await t.commit();
    res.json(userAtualizada);
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao atualizar usuário" });
  }
});

export default router;
