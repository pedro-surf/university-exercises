import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { Local } from "./Local";
import { InscricaoCurso } from "./InscricaoCurso";
import { Usuario } from "./Usuario";
import { Certificado } from "./Certificado";

class Curso extends Model {}

Curso.init(
  {
    curso_id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    professor_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    local_id: {
      type: DataTypes.UUID,
    },
    title: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    credit_hours: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
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
    modelName: "Curso",
    tableName: "curso",
    timestamps: false,
  }
);

Curso.belongsTo(Local, { foreignKey: "local_id", as: "local" });
Local.hasMany(Curso, {
  foreignKey: "local_id",
  sourceKey: "local_id",
  as: "cursos",
});
Curso.belongsToMany(Usuario, {
  through: InscricaoCurso,
  as: "inscricoes",
  foreignKey: "curso_id",
  otherKey: "usuario_id",
});
Curso.belongsTo(Usuario, { foreignKey: "professor_id", as: "owner" });
Curso.hasMany(Certificado, { foreignKey: "curso_id", as: "certificados" });
Certificado.hasOne(Curso, {
  foreignKey: "curso_id",
  as: "curso",
  sourceKey: "curso_id",
});

export { Curso };
