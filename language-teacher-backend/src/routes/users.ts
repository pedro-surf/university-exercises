// src/modules/user/routes.ts
import { Router } from "express";
import { createCrud } from "../lib/rest";
import { auth } from "../middleware/auth";

const router = Router();
const { getOne, create } = createCrud("users");

router.get("/:id", auth, getOne);
router.post("/", create);

export default router;