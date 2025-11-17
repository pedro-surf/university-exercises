import express from "express";
import { PresencaCurso } from "../entities/PresencaCurso";
import { PresencaEvento } from "../entities/PresencaEvento";
import { PresencaProjeto } from "../entities/PresencaProjeto";

const router = express.Router();

  
router.post("/", async (req, res) => {
  try {
    const { type, id, usuario_id } = req.body;
    switch (type) {
      case "courses":
        await PresencaCurso.create({ usuario_id, curso_id: id });
        break;
      case "events":
        await PresencaEvento.create({ usuario_id, evento_id: id });
        break;
      case "projects":
        await PresencaProjeto.create({ usuario_id, projeto_id: id });
        break;
      default:
        break;
    }
    res.status(201).json({ success: true });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao anotar frequencia" });
  }
});

export default router;
