import React from 'react';
import { Box, Slider, Typography, TextField } from '@mui/material';

const Sidebar = ({ waveHeight, setWaveHeight, wavePeriod, setWavePeriod, numPeople, setNumPeople }) => {
  return (
    <Box>
      <Typography variant="h6">Parameters</Typography>
      <Typography gutterBottom>Wave Height (m)</Typography>
      <Slider
        value={waveHeight}
        onChange={(e, newValue) => setWaveHeight(newValue)}
        min={0.5}
        max={5}
        step={0.1}
        valueLabelDisplay="auto"
      />
      <Typography gutterBottom>Wave Period (s)</Typography>
      <Slider
        value={wavePeriod}
        onChange={(e, newValue) => setWavePeriod(newValue)}
        min={1}
        max={10}
        step={0.1}
        valueLabelDisplay="auto"
      />
      <Typography gutterBottom>Number of People</Typography>
      <TextField
        type="number"
        value={numPeople}
        onChange={(e) => setNumPeople(e.target.value)}
        inputProps={{ min: 1 }}
      />
    </Box>
  );
};

export default Sidebar;
