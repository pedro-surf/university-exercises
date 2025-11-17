require("dotenv").config();
const { spawnSync } = require("child_process");
const emissor = require("./emissor");
const sequencerWeekday = require("./sequencerWeekday");
const sequencerWeekend = require("./sequencerWeekend");

module.exports = {
  emissor,
  sequencerWeekday,
  sequencerWeekend,
};