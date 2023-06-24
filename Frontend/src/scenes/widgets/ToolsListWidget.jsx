import { Box, Typography, useTheme } from "@mui/material";
import Friend from "components/Friend";
import WidgetWrapper from "components/WidgetWrapper";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setFriends } from "state";
import * as actions from "../../state/tools/toolActions";
import Tool from "components/Tool";

const ToolsListWidget = ({ userId }) => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.auth?.token);
  const toolsState = useSelector((state) => state.tools);
  const { data } = toolsState;
  useEffect(() => {
    dispatch(actions.fetchTools(null, token));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <WidgetWrapper>
      <Typography color={palette.neutral.dark} variant="h5" fontWeight="500" sx={{ mb: "1.5rem" }}>
        Tools List
      </Typography>
      <Box display="flex" flexDirection="column" gap="1.5rem">
        {data.map((tool) => (
          <Tool
            key={tool._id}
            toolId={tool._id}
            name={`${tool.maker} ${tool.model}`}
            subtitle={tool.shortDescription}
            images={tool.images}
            
          />
        ))}
      </Box>
    </WidgetWrapper>
  );
};

export default ToolsListWidget;
