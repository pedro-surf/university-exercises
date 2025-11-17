const fs = require("fs");
const path = require("path");
const getOsData = require("./getOsData");

function generateLogFile(agente, sequenciador) {
  const dados = getOsData(sequenciador);
  const data = {
    agente,
    sequenciador,
    timestamp: new Date().toISOString(),
    status: "ok",
    dados,
  };

  const logDir = path.join(__dirname, "..", "logs");
  if (!fs.existsSync(logDir)) fs.mkdirSync(logDir);

  const filePath = path.join(
    logDir,
    `${agente}-${new Date().toISOString().split("T")[0]}.json`
  );
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  console.log(`📝 Log salvo: ${filePath}`);
}

module.exports = generateLogFile;
