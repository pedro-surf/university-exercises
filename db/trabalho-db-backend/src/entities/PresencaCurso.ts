import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { InscricaoCurso } from "./InscricaoCurso";


class PresencaCurso extends Model {}

PresencaCurso.init(
  {
    presenca_curso_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    inscricao_curso_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "InscricaoCurso",
        key: "inscricao_curso_id",
      },
    },
    attended: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
  {
    sequelize,
    tableName: "presenca_curso",
  }
);

PresencaCurso.belongsTo(InscricaoCurso, {
  foreignKey: "inscricao_curso_id",
  as: "inscricao",
});
InscricaoCurso.hasOne(PresencaCurso, {
  foreignKey: "inscricao_curso_id",
  as: "presenca",
  sourceKey: "inscricao_curso_id",
});

export { PresencaCurso };
