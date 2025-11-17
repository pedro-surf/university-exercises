const generateLogFile = require('./utils/generateLogFile');

const agente3 = async () => {
  console.log("🔧 Executando agente 3");
  await new Promise((res) => setTimeout(res, 1000));
  generateLogFile("agente3", process.env.SEQUENCIADOR || "manual");
  console.log("✔️ Agente 3 finalizado");
};

module.exports = agente3;
