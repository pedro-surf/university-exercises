import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { InscricaoProjeto } from "./InscricaoProjeto";

class PresencaProjeto extends Model {}

PresencaProjeto.init(
  {
    presenca_projeto_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    inscricao_projeto_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "InscricaoProjeto",
        key: "inscricao_projeto_id",
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

PresencaProjeto.belongsTo(InscricaoProjeto, {
  foreignKey: "inscricao_projeto_id",
  as: "inscricao",
});
InscricaoProjeto.hasOne(PresencaProjeto, {
  foreignKey: "inscricao_projeto_id",
  as: "presenca",
  sourceKey: "inscricao_projeto_id",
});

export { PresencaProjeto };
