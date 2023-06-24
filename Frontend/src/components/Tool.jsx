import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FlexBetween from "./FlexBetween";
import UserImage from "./UserImage";
import DeleteIcon from "@mui/icons-material/Delete";
import ConfirmModal from "./ConfirmModal";
import { useState } from "react";
import * as actions from "../state/tools/toolActions";

const Tool = ({ toolId, name, subtitle, images }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [confirmModal, setConfirmationModal] = useState(false);
  const { _id } = useSelector((state) => state.auth?.user);
  const tools = useSelector((state) => state.tools);
  const token = useSelector((state) => state.auth?.token);
  const { palette } = useTheme();
  const main = palette.neutral.main;
  const medium = palette.neutral.medium;
  const primaryLight = palette.primary.light;
  const primaryDark = palette.primary.dark;
  const isLoggedInUser = tools.data.find((tool) => tool.userId === _id);

  const handleConfirm = () => {
    dispatch(actions.deleteTool(toolId, token)).then((success) => {
      if (success) {
        dispatch(actions.fetchTools(null, token));
        setConfirmationModal(false);
      }
    });
  };
  return (
    <FlexBetween>
      <FlexBetween gap="1rem">
        <UserImage image={images[0]} size="55px" />
        <Box
          onClick={() => {
            navigate(`/tool/${toolId}`);
            navigate(0);
          }}
        >
          <Typography
            color={main}
            variant="h5"
            fontWeight="500"
            sx={{
              "&:hover": {
                color: palette.primary.light,
                cursor: "pointer",
              },
            }}
          >
            {name}
          </Typography>
          <Typography color={medium} fontSize="0.75rem">
            {subtitle}
          </Typography>
        </Box>
      </FlexBetween>
      <IconButton onClick={(e) => setConfirmationModal(true)} sx={{ backgroundColor: primaryLight, p: "0.6rem" }}>
        {isLoggedInUser && <DeleteIcon sx={{ color: primaryDark }} />}
      </IconButton>
      <ConfirmModal open={confirmModal} setOpen={setConfirmationModal} handleConfirm={handleConfirm} title={"Delete Tool"} />
    </FlexBetween>
  );
};

export default Tool;
