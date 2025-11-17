const generateLogFile = require('./utils/generateLogFile');

const agente1 = async () => {
  console.log("🔧 Executando agente 1");
  await new Promise((res) => setTimeout(res, 1000));
  generateLogFile("agente1", process.env.SEQUENCIADOR || "manual");
  console.log("✔️ Agente 1 finalizado");
};

module.exports = agente1;
