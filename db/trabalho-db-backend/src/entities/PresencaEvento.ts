import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { InscricaoEvento } from "./InscricaoEvento";

class PresencaEvento extends Model {}

PresencaEvento.init(
  {
    presenca_evento_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    inscricao_evento_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "InscricaoEvento",
        key: "inscricao_evento_id",
      },
    },
    attended: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    sequelize,
    modelName: "PresencaEvento",
    tableName: "presenca_evento",
    timestamps: false,
  }
);

PresencaEvento.belongsTo(InscricaoEvento, {
  foreignKey: "inscricao_evento_id",
  as: "inscricao",
});
InscricaoEvento.hasOne(PresencaEvento, {
  foreignKey: "inscricao_evento_id",
  as: "presenca",
  sourceKey: "inscricao_evento_id",
});

export { PresencaEvento };
