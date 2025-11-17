import { Model, DataTypes } from "sequelize";
import { sequelize } from "../database";

class InscricaoProjeto extends Model {}

InscricaoProjeto.init(
  {
    inscricao_projeto_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    projeto_id: {
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
    modelName: "InscricaoProjeto",
    tableName: "inscricao_projeto",
    timestamps: false,
  }
);

export { InscricaoProjeto };
