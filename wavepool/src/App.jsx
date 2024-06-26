import React, { useState } from "react";
import { Container, Grid } from "@mui/material";
import Sidebar from "./components/Sidebar";
import WaveDisplay from "./components/WaveDisplay";
import GymDisplay from "./components/GymDisplay";

const WATER_DENSITY = 1000;
const GRAVITY_ACC = 9.81;
const HUMAN_POWER_OUTPUT = 150; // considerando que cada usuário da academia gera 150W de potência
const MECHANICAL_WORK_EFFICIENCY = 0.25;

const App = () => {
  const [waveHeight, setWaveHeight] = useState(2);
  const [wavePeriod, setWavePeriod] = useState(4);
  const [wavepoolLength, setWavepoolLength] = useState(15); // considerando que a onda desloca-se por 15m

  const waveEnergy =
    (WATER_DENSITY * GRAVITY_ACC * waveHeight * waveHeight * wavepoolLength) / 8;

  const personEnergy = HUMAN_POWER_OUTPUT * wavePeriod;

  const waveHumanWork = waveEnergy / MECHANICAL_WORK_EFFICIENCY;

  const numPeople = waveHumanWork / personEnergy;

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Sidebar
            waveHeight={waveHeight}
            setWaveHeight={setWaveHeight}
            wavePeriod={wavePeriod}
            setWavePeriod={setWavePeriod}
            wavepoolLength={wavepoolLength}
            setWavepoolLength={setWavepoolLength}
            waveHumanWork={waveHumanWork}
            waveEnergy={waveEnergy}
          />
        </Grid>
        <Grid item xs={9}>
          <WaveDisplay
            waveEnergy={waveEnergy}
            waveHeight={waveHeight}
            wavePeriod={wavePeriod}
          />
          <GymDisplay numPeople={numPeople} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
