import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

class InscricaoCurso extends Model {}

InscricaoCurso.init(
  {
    inscricao_curso_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    curso_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "InscricaoCurso",
    tableName: "inscricao_curso",
    timestamps: false,
  }
);

export { InscricaoCurso };
