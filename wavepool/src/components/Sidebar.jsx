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
  waveSpeed,
  waveDuration,
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
      <Typography gutterBottom>Wave "extension" (m)</Typography>
      <TextField
        type="number"
        value={wavepoolLength}
        onChange={(e) => setWavepoolLength(e.target.value)}
        inputProps={{ min: 1 }}
      />
      <Typography marginTop={6} variant="h6">
        Wave information
      </Typography>
      <Typography marginTop={2} sx={{ textDecoration: "line-through" }}>
        Energy: {Number(waveEnergy / 1000).toFixed(2)} kJ
      </Typography>
      <Typography sx={{ textDecoration: "line-through" }}>(E = ρgH²L/8)</Typography>
      <Typography marginTop={2}>
        Mechanical Work: {Number(waveHumanWork / 1000).toFixed(2)} kJ
      </Typography>
      <Typography>(W = E / n, consider n = 0.25)</Typography>
      <Typography marginTop={2}>
        Speed:
        {Number(waveSpeed).toFixed(2)} m/s
      </Typography>
      <Typography>(V = sqrt(gh); h = 1)</Typography>
      <Typography marginTop={2}>
        Duration:
        {Number(waveDuration).toFixed(2)} s
      </Typography>
    </Box>
  );
};

export default Sidebar;
