const agente1 = require("./agente1");
const agente2 = require("./agente2");
const agente3 = require("./agente3");

const sequenciadorSemana = async () => {
  process.env.SEQUENCIADOR = "sequenciadorSemana";
  console.log("📦 Sequenciador da SEMANA com bastão. Executando agentes...");
  await agente1();
  await new Promise((res) => setTimeout(res, 3000));
  await agente2();
  await new Promise((res) => setTimeout(res, 3000));
  await agente3();
  console.log("✅ Sequência SEMANA finalizada.");
  return { statusCode: 200, body: "Sequência SEMANA concluída" };
};

module.exports = sequenciadorSemana;
