import React from "react";
import Dialog from "@mui/material/Dialog";
import Box from "@mui/material/Box";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import RestoreFromTrashIcon from "@mui/icons-material/RestoreFromTrash";
import { useTheme } from "@mui/material";

function ConfirmModal(props) {
  const { open, setOpen, handleConfirm, title } = props;
  const { palette } = useTheme();
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  return (
    <React.Fragment>
      <Dialog disablePortal open={open} onClose={e => setOpen(false)}>
        <DialogTitle fontSize={"20px"} color={"#000000DE"}>
          {title}
        </DialogTitle>
        <DialogContent sx={{ minHeight: "200px" }}>
          <Box sx={{ width: "30ch", marginTop: "90px" }}> Are you sure you want to delete this?</Box>
        </DialogContent>
        <DialogActions>
          <Button sx={{ backgroundColor: primaryLight }} onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            sx={{ backgroundColor: primaryDark, color: palette.background.alt, "&:hover": { color: palette.primary.main } }}
            onClick={() => handleConfirm()}
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default ConfirmModal;
