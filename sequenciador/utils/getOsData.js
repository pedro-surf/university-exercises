const os = require("os");

const getOsData = (sequenciador) => {
  if (sequenciador === "sequencerWeekend") {
    const disco = fs.statSync(".");
    return {
      etapa: "v2",
      hostname: os.hostname(),
      plataforma: os.platform(),
      espacoUsado: disco.blocks || "N/A",
      espacoDisponivel: disco.blksize || "N/A",
      data: new Date().toISOString(),
    };
  } else {
    return {
      hostname: os.hostname(),
      plataforma: os.platform(),
      uptime: os.uptime(),
      cpus: os.cpus().length,
      carga: os.loadavg(),
      totalMem: os.totalmem(),
      livreMem: os.freemem(),
      data: new Date().toISOString(),
    };
  }
};

module.exports = getOsData;
