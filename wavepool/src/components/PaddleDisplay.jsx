import React, { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";
import {
  WATER_DENSITY,
  STANDARD_DISPLACEMENT,
  GRAVITY_ACC,
} from "../constants";

const PaddleDisplay = ({ height, wavepoolLength, waveEnergy }) => {
  const [width, setWidth] = useState(0.5);

  const waterVolume = height * width * STANDARD_DISPLACEMENT;
  const waterMass = waterVolume * WATER_DENSITY;
  const work = waterVolume * height * WATER_DENSITY * GRAVITY_ACC;
  const paddleAmountPerWave = wavepoolLength / width;
  const waveWork = paddleAmountPerWave * work;

  return (
    <Box>
      <Typography marginTop={6} variant="h6">
        Paddle information
      </Typography>
      <Typography gutterBottom>Width: {width} m</Typography>
      <Slider
        value={width}
        onChange={(e, newValue) => setWidth(newValue)}
        min={0.2}
        max={1.5}
        step={0.1}
        valueLabelDisplay="auto"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          border: "1px solid gray",
          marginBottom: 3,
        }}
      >
        <Box
          sx={{
            width: `${width * 100}px`,
            height: `${height * 100}px`,
            margin: 4,
            background: "brown",
            borderRadius: "6px",
          }}
        />
      </Box>
      <Typography gutterBottom>
        Paddle displacement: {STANDARD_DISPLACEMENT} m{" "}
      </Typography>
      <Typography gutterBottom>
        Approx. # of paddles needed: {Math.floor(paddleAmountPerWave)}
      </Typography>
      <Typography gutterBottom>
        Displaced water: {Number(waterMass).toFixed(2)} kg
      </Typography>
      <Typography gutterBottom>
        Volume: {Number(waterVolume).toFixed(2)} m³
      </Typography>
      <Typography gutterBottom>
        Paddle Work: {Number(work / 1000).toFixed(2)} kJ
      </Typography>
      <Typography sx={{ marginBottom: 3 }}>(W = ρgHV)</Typography>
      <Typography gutterBottom>
        Total work per wave: {Number(waveWork / 1000).toFixed(2)} kJ
      </Typography>
      <Box
        sx={{
          height: `${height * 50 + 100}px`,
          marginTop: `${height * 50}px`,
          marginBottom: 3,
        }}
        className="paddle-container"
      >
        <Box className="paddle-container-helper" />
        <Box className="paddle-left-container" />
        <Box className="paddle-right-container" />
        <Box
          className="paddle"
          sx={{
            width: `80px`,
            height: height * 50,
          }}
        />
      </Box>
    </Box>
  );
};

export default PaddleDisplay;
