const generateLogFile = require('./utils/generateLogFile');

const agente2 = async () => {
  console.log("🔧 Executando agente 2");
  await new Promise((res) => setTimeout(res, 1000));
  generateLogFile("agente2", process.env.SEQUENCIADOR || "manual");
  console.log("✔️ Agente 2 finalizado");
};

module.exports = agente2;
