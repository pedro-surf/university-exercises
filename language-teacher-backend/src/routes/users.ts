// src/modules/user/routes.ts
import { Router } from "express";
import { createCrud } from "../lib/rest";
import { auth } from "../middleware/auth";

const router = Router();
const crud = createCrud("users");

router.get("/:id", auth, crud.getOne);
router.post("/", crud.create);

export default router;