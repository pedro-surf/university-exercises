import { Op } from "sequelize";
import { Local } from "../entities/Local";
import { Evento } from "../entities/Evento";
import { Projeto } from "../entities/Projeto";
import { Curso } from "../entities/Curso";

export default async ({ start_at, end_at, local_id }: any) => {
  const where = {
    [Op.or]: {
      start_at: {
        [Op.between]: [start_at, end_at],
      },
      end_at: {
        [Op.between]: [start_at, end_at],
      },
    },
  };
  // reserva de local
  const local = await Local.findByPk(local_id, {
    include: [
      {
        as: "eventos",
        model: Evento,
        where,
        required: false,
      },
      {
        as: "projetos",
        model: Projeto,
        where,
        required: false,
      },
      {
        as: "cursos",
        model: Curso,
        where,
        required: false,
      },
    ],
  });
  console.log({ local });
  if (
    (local?.projetos && local.projetos.length > 0) ||
    (local?.eventos && local.eventos.length > 0) ||
    (local?.cursos && local.cursos.length > 0)
  ) {
    throw new Error("Local já reservado");
  }
};
