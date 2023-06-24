import { Box, Typography } from '@mui/material'
import React from 'react'

const EmptyChatBox = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Typography variant="h3" className="header-message">
        Click on a user to start chatting
      </Typography>
     
    </Box>
  );
}

export default EmptyChatBox