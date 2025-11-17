import { Model, DataTypes, fn } from "sequelize";
import { sequelize } from "../database";
import { Certificado } from "./Certificado";

const USER_TYPE = ["estudante", "professor", "visitante"];

export type UserType = typeof USER_TYPE[number];

class Usuario extends Model {
  public usuario_id!: string;
  public nome!: string;
  public sobrenome!: string;
  public role!: UserType;
  public email!: string;
  public password!: string;
  public cidade!: string;
  public created_by!: string;
  public created_at!: Date;
  public updated_at!: Date;
}

Usuario.init(
  {
    usuario_id: {
      type: DataTypes.UUID,
      defaultValue: fn("gen_random_uuid"),
      primaryKey: true,
    },
    nome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    sobrenome: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM(...USER_TYPE),
      allowNull: false,
    },
    email: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    password: {
      type: DataTypes.TEXT,
    },
    cidade: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    created_by: {
      type: DataTypes.UUID,
    },
    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Usuario",
    tableName: "usuario",
    timestamps: false,
  }
);

Usuario.hasMany(Certificado, { foreignKey: "usuario_id", as: "certificados" });
Certificado.belongsTo(Usuario, { foreignKey: "usuario_id", as: "owner" });

export { Usuario };
