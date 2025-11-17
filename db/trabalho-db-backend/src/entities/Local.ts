import { Model, DataTypes,  fn  } from "sequelize";
import { sequelize } from "../database";

class Local extends Model {
  projetos?: any[];
  cursos?: any[];
  eventos?: any[];
}

Local.init(
  {
    local_id: {
      type: DataTypes.UUID,
      defaultValue: fn('gen_random_uuid'),
      primaryKey: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sala: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    endereco: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    capacidade: {
        type: DataTypes.NUMBER,
        allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Local",
    tableName: "local",
    timestamps: false,
  }
);

export { Local };
