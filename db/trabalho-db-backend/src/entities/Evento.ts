import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { Certificado } from "./Certificado";
import { InscricaoEvento } from "./InscricaoEvento";
import { Local } from "./Local";
import { Usuario } from "./Usuario";

class Evento extends Model {}

Evento.init(
  {
    evento_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    professor_id: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    local_id: {
      type: DataTypes.UUID,
    },
    start_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    end_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Evento",
    tableName: "evento",
    timestamps: false,
  }
);

Evento.belongsTo(Local, { foreignKey: "local_id", as: "local" });
Local.hasMany(Evento, {
  foreignKey: "local_id",
  sourceKey: "local_id",
  as: "eventos",
});
Evento.belongsToMany(Usuario, {
  through: InscricaoEvento,
  as: "inscricoes",
  foreignKey: "evento_id",
  otherKey: "usuario_id",
});
Evento.belongsTo(Usuario, { foreignKey: "professor_id", as: "owner" });
Evento.hasMany(Certificado, { foreignKey: "evento_id", as: "certificados" });
Certificado.hasOne(Evento, {
  foreignKey: "evento_id",
  as: "evento",
  sourceKey: "evento_id",
});

export { Evento };
