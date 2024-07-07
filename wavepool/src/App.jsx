import React, { useState } from "react";
import { Container, Grid, Tab, Tabs } from "@mui/material";
import Sidebar from "./components/Sidebar";
import WaveDisplay from "./components/WaveDisplay";
import GymDisplay from "./components/GymDisplay";
import PaddleDisplay from "./components/PaddleDisplay";

const WATER_DENSITY = 1000;
const GRAVITY_ACC = 9.81;
const HUMAN_POWER_OUTPUT = 150; // considerando que cada usuário da academia gera 150W de potência
const MECHANICAL_WORK_EFFICIENCY = 0.25;

const App = () => {
  const [waveHeight, setWaveHeight] = useState(2);
  const [wavePeriod, setWavePeriod] = useState(4);
  const [wavepoolLength, setWavepoolLength] = useState(15); // considerando que a onda desloca-se por 15m

  const [view, setView] = useState("wave");

  const waveEnergy =
    (WATER_DENSITY * GRAVITY_ACC * waveHeight * waveHeight * wavepoolLength) /
    8;

  const personEnergy = HUMAN_POWER_OUTPUT * wavePeriod;

  const waveHumanWork = waveEnergy / MECHANICAL_WORK_EFFICIENCY;

  const numPeople = waveHumanWork / personEnergy;

  const waveSpeed = wavepoolLength / wavePeriod;

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
            waveSpeed={waveSpeed}
          />
        </Grid>
        <Grid item xs={9}>
          <Tabs
            value={view}
            onChange={(e, tab) => setView(tab)}
            aria-label="basic tabs example"
            sx={{
              marginBottom: 3,
            }}
          >
            <Tab label="Wave settings" value="wave" />
            <Tab label="Paddle settings" value="paddle" />
          </Tabs>
          {view === "wave" ? (
            <>
              <WaveDisplay
                waveEnergy={waveEnergy}
                waveHeight={waveHeight}
                wavePeriod={wavePeriod}
              />
              <GymDisplay numPeople={numPeople} />
            </>
          ) : (
            <PaddleDisplay height={waveHeight} />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
