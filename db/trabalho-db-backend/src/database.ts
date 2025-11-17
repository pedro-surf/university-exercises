import { Sequelize } from "sequelize";

// Create a new Sequelize instance
const sequelize = new Sequelize("mydatabase", "postgres", "password", {
  host: "localhost",
  port: 5433,
  dialect: "postgres",
});

export { sequelize };
