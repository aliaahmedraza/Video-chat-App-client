import React from 'react';
import { Typography, AppBar, Box } from '@mui/material';
import VideoPlayer from './components/VideoPlayer';
import Options from './components/Options';
import Notifications from './components/Notifications';

const App = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '100%',
      }}
    >
      <AppBar
        position="static"
        color="inherit"
        sx={{
          borderRadius: 2,
          m: '30px 100px',
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
          width: '600px',
          border: '2px solid black',
          '@media (max-width:600px)': {
            width: '90%',
          },
        }}
      >
        <Typography variant="h6" align="center">
          Video Chat App
        </Typography>
      </AppBar>

      <VideoPlayer />

      <Options>
        <Notifications />
      </Options>
    </Box>
  );
};

export default App;
