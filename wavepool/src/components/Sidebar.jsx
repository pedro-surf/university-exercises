import React from "react";
import { Box, Slider, Typography, TextField } from "@mui/material";

const Sidebar = ({
  waveHeight,
  setWaveHeight,
  wavePeriod,
  setWavePeriod,
  wavepoolLength,
  setWavepoolLength,
  waveEnergy,
  waveHumanWork,
}) => {
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
      <Typography gutterBottom>Wave pool length (m)</Typography>
      <TextField
        type="number"
        value={wavepoolLength}
        onChange={(e) => setWavepoolLength(e.target.value)}
        inputProps={{ min: 1 }}
      />
      <Typography marginTop={6} variant="h6">
        Wave information
      </Typography>
      <Typography>(10m length)</Typography>
      <Typography marginTop={2}>
        Energy: {Number(waveEnergy / 1000).toFixed(2)}kJ
      </Typography>
      <Typography>(E = 1/8*ρgH²)</Typography>
      <Typography marginTop={2}>
        Power: {Number(waveEnergy / wavePeriod / 1000).toFixed(2)}kW
      </Typography>
      <Typography>(P = E / T)</Typography>
      <Typography marginTop={2}>
        Mechanical Work:
        {Number(waveHumanWork / 1000).toFixed(2)}kJ
      </Typography>
      <Typography>(W = E / n, consider n = 0.25)</Typography>
    </Box>
  );
};

export default Sidebar;
