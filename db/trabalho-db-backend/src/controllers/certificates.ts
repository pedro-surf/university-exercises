import express from "express";
import { Op } from "sequelize";
import { sequelize } from "../database";
import { Certificado } from "../entities/Certificado"; // Import your Sequelize model
import { Evento } from "../entities/Evento";
import { Local } from "../entities/Local";
import { authenticate } from "../middleware/authenticate";

const router = express.Router();

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    // Find all users using Sequelize model
    const certificates = await Certificado.findAll({
      include: ["owner", "curso", "evento", "projeto"],
      where: {
        // @ts-ignore
        usuario_id: req.user?.usuario_id,
      },
    });
    res.json({ certificates });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar certificados" });
  }
});

router.get("/winners-ararangua", async (_req, res) => {
  try {
    // Find all users using Sequelize model
    const certificates = await Certificado.findAll({
      include: [
        "owner",
        {
          model: Evento,
          as: "evento",
          include: [
            {
              model: Local,
              as: "local",
              where: {
                nome: { [Op.iLike]: "ufsc ararangua" },
              },
            },
          ],
        },
      ],
      group: ["owner.usuario_id", "evento.evento_id", "evento->local.local_id"],
      attributes: [
        "owner.nome",
        [sequelize.fn("COUNT", sequelize.col("*")), "count"],
      ],
      order: [[sequelize.col("count"), "DESC"]],
    });
    res.json({ certificates });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar certificados" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { id, type, ...newCertificado } = req.body;
    switch (type) {
      case "courses":
        newCertificado.curso_id = id;
        break;
      case "events":
        newCertificado.evento_id = id;
        break;
      case "projects":
        newCertificado.projeto_id = id;
        break;
      default:
        break;
    }
    // Create a new user using Sequelize model
    const CertificadoCriado = await Certificado.create(newCertificado);
    res.status(201).json({ certificate: CertificadoCriado });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar Certificado" });
  }
});

export default router;
