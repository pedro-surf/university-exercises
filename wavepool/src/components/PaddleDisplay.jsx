import React, { useState } from "react";
import { Box, Typography, Slider } from "@mui/material";

const PaddleDisplay = ({ height }) => {
  const [width, setWidth] = useState(5);

  return (
    <Box>
      <Typography variant="h6">Paddle Settings (fase 2)</Typography>

      <Box
        sx={{
          height: `${height * 100 + 100}px`,
          marginTop: `${height * 100}px`,
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
            height: height * 100,
          }}
        />
      </Box>
      <Typography gutterBottom>Paddle width: {width} m</Typography>
      <Slider
        value={width}
        onChange={(e, newValue) => setWidth(newValue)}
        min={0.2}
        max={1.5}
        step={0.2}
        valueLabelDisplay="auto"
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          width: "100%",
          border: "1px solid gray",
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
    </Box>
  );
};

export default PaddleDisplay;
