import React, { useState } from 'react';
import { Container, Grid } from '@mui/material';
import Sidebar from './components/Sidebar';
import WaveDisplay from './components/WaveDisplay';
import EcoGymDisplay from './components/EcoGymDisplay';

const App = () => {
  const [waveHeight, setWaveHeight] = useState(2);
  const [wavePeriod, setWavePeriod] = useState(4);
  const [numPeople, setNumPeople] = useState(50);

  return (
    <Container>
      <Grid container spacing={3}>
        <Grid item xs={3}>
          <Sidebar 
            waveHeight={waveHeight} 
            setWaveHeight={setWaveHeight} 
            wavePeriod={wavePeriod} 
            setWavePeriod={setWavePeriod} 
            numPeople={numPeople} 
            setNumPeople={setNumPeople} 
          />
        </Grid>
        <Grid item xs={9}>
          <WaveDisplay waveHeight={waveHeight} wavePeriod={wavePeriod} />
          <EcoGymDisplay numPeople={numPeople} />
        </Grid>
      </Grid>
    </Container>
  );
};

export default App;
