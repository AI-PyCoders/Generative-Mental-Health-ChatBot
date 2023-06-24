import React from "react";
import { Box, Typography, Modal, Button } from "@mui/material";

const CustomModal = ({ open, setOpen, title, childComponent,onSubmit }) => {
  const handleClose = () => setOpen(false);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    p: 4,
    padding: "15px 24px",
    "& h2": {
      fontFamily: "AvenirNext",
      fontWeight: 500,
    },
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ position: "relative", width: "100%", height: "100%" }}>
          <Box textAlign={"center"}>
            <Typography variant="h6">{title}</Typography>
          </Box>
          {childComponent}
          <Box textAlign={"end"} margin={"1rem"}>
            <Button variant="text" onClick={handleClose}>{"Cancel"}</Button>
            <Button variant="contained" onClick={onSubmit}>{"Save"}</Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export default CustomModal;
