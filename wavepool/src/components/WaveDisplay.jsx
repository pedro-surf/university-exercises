import React from "react";
import { Box, Typography } from "@mui/material";

const WaveDisplay = ({ waveHeight, wavePeriod }) => {
  return (
    <Box>
      <Typography variant="h6">Wave Display</Typography>
      <Typography>Wave Height: {waveHeight} meters</Typography>
      <Typography>Wave Period: {wavePeriod} seconds</Typography>
      <Box className="wave-container">
        <WaveSection wavePeriod={wavePeriod} waveHeight={waveHeight} />
      </Box>
    </Box>
  );
};

const WaveSection = ({ wavePeriod, waveHeight, index = 0 }) => (
  <Box
    key={`wrapper-${index}`}
    className="wave"
    sx={{
      animationDuration: `${wavePeriod}s`,
      display: "flex",
      flexDirection: "column",
      height: `${waveHeight * 12}%`,
      width: "10%",
    }}
  >
    <Box
      key={`foam-${index}`}
      sx={{
        height: `20%`,

        background: "white",
      }}
    />
    <Box
      key={`wave-${index}`}
      sx={{
        height: `80%`,
        background: "blue",
      }}
    />
  </Box>
);

export default WaveDisplay;
