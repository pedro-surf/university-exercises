import express from "express";
import * as bcrypt from "bcrypt";
import { Usuario } from "../entities/Usuario";
import { signJwtAccessToken } from "../jwt";

const router = express.Router();

router.post("/", async (req, res) => {
  const { email, password: reqPassword } = req.body;

  const user = await Usuario.findOne({ where: { email } });
  if (user) {
    const authenticated = await bcrypt.compare(reqPassword, user.password);
    if (!authenticated) {
      const hash = await bcrypt.hash(reqPassword, 10);
      console.log('Login failed', hash);
      return res.status(401).json(null);
    }
    const { password, ...userWithoutPass } = user.get();
    // Generate JWT
    const token = signJwtAccessToken(userWithoutPass);

    res.json({
      ...userWithoutPass,
      accessToken: token,
    });
  } else {
    console.log('Login failed. Could not find user')
    res.status(401).json(null);
  }
});


export default router;
