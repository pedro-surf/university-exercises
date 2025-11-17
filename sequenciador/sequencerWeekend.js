const agente1 = require("./agente1");
const agente2 = require("./agente2");
const agente3 = require("./agente3");

const sequencerWeekend = async () => {
  process.env.SEQUENCIADOR = "sequencerWeekend";
  console.log(
    "📦 Sequenciador do FIM DE SEMANA com bastão. Executando agentes..."
  );
  await agente1();
  await agente2();
  await agente3();
  console.log("✅ Sequência FDS finalizada.");
  return { statusCode: 200, body: "Sequência FDS concluída" };
};

module.exports = sequencerWeekend;
