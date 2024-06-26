import React from "react";
import { Box, Typography } from "@mui/material";

const EcoGymDisplay = ({ numPeople }) => (
  <Box>
    <Typography variant="h6">Eco Gym Display</Typography>
    <Typography>Number of People: {Math.floor(numPeople)}</Typography>
    {/* Add graphical representation here */}
    <Box
      sx={{
        height: "200px",
        background: "lightgreen",
        marginTop: "10px",
        position: "relative",
      }}
    >
      {Array.from({ length: numPeople }).map((_, index) => (
        <Box
          key={index}
          sx={{
            width: "10px",
            height: "20px",
            background: "green",
            margin: "2px",
            display: "inline-block",
          }}
        />
      ))}
    </Box>
  </Box>
);

export default EcoGymDisplay;
