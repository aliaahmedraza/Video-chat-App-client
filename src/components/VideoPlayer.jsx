import React, { useEffect, useRef } from 'react';
import Peer from 'simple-peer';
import useSocketStore, { socket } from '../zustandStore/socketStore';
import {Grid,Typography,Paper} from '@mui/material';
import { useTheme } from '@mui/material/styles';
const VideoCall = () => {
  const {
    stream,
    myId,
    call,
    callAccepted,
    callEnded,
    videocall,
    listenToSocketMeEvent,
    listenToSocketCallUserEvent,
    setCallAccepted,
    setCallEnded
  } = useSocketStore();
const theme = useTheme();
  const myVideoRef = useRef();
  const userVideoRef = useRef();
  const peerRef = useRef();

  useEffect(() => {
    videocall();
    listenToSocketMeEvent();
    listenToSocketCallUserEvent();
  }, [videocall,listenToSocketCallUserEvent,listenToSocketMeEvent]);

  useEffect(() => {
    if (stream && myVideoRef.current) {
      myVideoRef.current.srcObject = stream;
    }
  }, [stream]);

  const answerCall = () => {
    setCallAccepted(true);

    peerRef.current = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peerRef.current.on('signal', (data) => {
      socket.emit('answerCall', { signal: data, to: call.from });
    });

    peerRef.current.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream;
      }
    });

    peerRef.current.signal(call.signal);
  };

  const callUser = (idToCall, name) => {
    peerRef.current = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peerRef.current.on('signal', (data) => {
      socket.emit('callUser', {
        userToCall: idToCall,
        signalData: data,
        from: myId,
        name,
      });
    });

    peerRef.current.on('stream', (currentStream) => {
      if (userVideoRef.current) {
        userVideoRef.current.srcObject = currentStream;
      }
    });

    socket.on('callAccepted', (signal) => {
      setCallAccepted(true);
      peerRef.current.signal(signal);
    });
    
  };

  const leaveCall = () => {
    setCallEnded(true);

    if (peerRef.current) {
      peerRef.current.destroy();
    }

    window.location.reload();
  };

  return (
      <Grid container sx={{
    justifyContent: 'center',
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    }
  }}>
<Paper sx={{
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  }}>
<Grid item xs={12} md={6} >
<Typography variant='h5' gutterBottom >
Name
</Typography>
<video playsInline muted ref={myVideoRef} autoPlay style={{
    width: '550px',
    [theme.breakpoints.down('sm')]: {
      width: '300px',
    },
  }}></video>
</Grid>
</Paper>
<Paper sx={{
    padding: '10px',
    border: '2px solid black',
    margin: '10px',
  }}>
<Grid item xs={12} md={6} >
<Typography variant='h5' gutterBottom >
Name
</Typography>
<video playsInline ref={userVideoRef} autoPlay style={{
    width: '550px',
    [theme.breakpoints.down('sm')]: {
      width: '300px',
    },
  }}></video>
</Grid>
</Paper>
  </Grid>
  );
};

export default VideoCall;
