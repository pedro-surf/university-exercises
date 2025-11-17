import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";

class Certificado extends Model {}

Certificado.init(
  {
    certificado_id: {
      type: DataTypes.UUID,
      defaultValue: fn('gen_random_uuid'),
      allowNull: false,
      primaryKey: true
    },
    curso_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Curso",
        key: "curso_id",
      },
    },
    evento_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Evento",
        key: "evento_id",
      },
    },
    projeto_id: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "Projeto",
        key: "projeto_id",
      },
    },
    usuario_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    degree_name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    credit_hours: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  },
  {
    sequelize,
    timestamps: false,
    modelName: 'Certificado',
    tableName: 'certificado',
  }
);
export { Certificado };