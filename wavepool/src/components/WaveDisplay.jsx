import React from 'react';
import { Box, Typography } from '@mui/material';

const WaveDisplay = ({ waveHeight, wavePeriod }) => {
  return (
    <Box>
      <Typography variant="h6">Wave Display</Typography>
      <Typography>Wave Height: {waveHeight} meters</Typography>
      <Typography>Wave Period: {wavePeriod} seconds</Typography>
      {/* Add graphical representation here */}
      <Box sx={{ height: '200px', background: 'lightblue', marginTop: '10px', position: 'relative' }}>
        <Box sx={{
          height: `${waveHeight * 10}%`,
          width: '100%',
          background: 'blue',
          position: 'absolute',
          bottom: 0
        }} />
      </Box>
    </Box>
  );
};

export default WaveDisplay;
