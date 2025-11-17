const emissor = async () => {
  const today = new Date();
  const diaSemana = today.getDay(); // 0 = domingo, 6 = sábado

  const fimDeSemana = diaSemana === 0 || diaSemana === 6;
  const alvo = fimDeSemana ? "sequencerWeekend" : "sequencerWeekday";

  console.log(
    `⏰ Hoje é ${
      ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"][diaSemana]
    } → chamando ${alvo}`
  );

  await fetch(`${process.env.SEQUENCIADOR_URL}/${alvo}`, { method: "POST" });

  return { statusCode: 200, body: `Sequenciador ${alvo} acionado` };
};

module.exports = emissor;
