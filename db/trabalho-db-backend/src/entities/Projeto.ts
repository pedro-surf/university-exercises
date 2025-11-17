import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { Certificado } from "./Certificado";
import { InscricaoProjeto } from "./InscricaoProjeto";
import { Local } from "./Local";
// import { InscricaoProjeto } from "./InscricaoProjeto";
import { Usuario } from "./Usuario";

class Projeto extends Model {}
Projeto.init(
  {
    projeto_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    professor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    created_at: {
      type: DataTypes.DATE,
      defaultValue: fn("now"),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Projeto",
    tableName: "projeto",
    timestamps: false,
  }
);

Projeto.belongsTo(Local, { foreignKey: "local_id", as: "local" });
Local.hasMany(Projeto, {
  foreignKey: "local_id",
  sourceKey: "local_id",
  as: "projetos",
});
Projeto.hasMany(InscricaoProjeto, {
  as: "inscricoes",
  foreignKey: "projeto_id",
});
InscricaoProjeto.belongsTo(Projeto, {
  as: "projeto",
  foreignKey: "projeto_id",
});
Projeto.belongsTo(Usuario, { foreignKey: "professor_id", as: "owner" });
Usuario.hasMany(Projeto, { foreignKey: "professor_id", as: "projetos" });
Projeto.hasMany(Certificado, { foreignKey: "projeto_id", as: "certificados" });
Certificado.hasOne(Projeto, {
  foreignKey: "projeto_id",
  as: "projeto",
  sourceKey: "projeto_id",
});

export { Projeto };
