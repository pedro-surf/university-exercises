import express from "express";
import { Local } from "../entities/Local";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const locais = await Local.findAll({
      where: req.query,
    });
    res.json({ locais });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao encontrar o local" });
  }
});
  
router.post("/", async (req, res) => {
  try {
    const newLoc = req.body;
    // Create a new user using Sequelize model
    const locCriado = await Local.create(newLoc);
    res.status(201).json({ event: locCriado });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error: "Erro ao criar o local" });
  }
});

export default router;
