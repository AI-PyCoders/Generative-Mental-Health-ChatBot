import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Details";
import Navbar from "scenes/navbar";
import Details from "./Details";

const ToolDetailPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      <Navbar />
      <Box
        width={isNonMobileScreens ? "70%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography align="center" fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Tool
        </Typography>
        <Details />
      </Box>
    </Box>
  );
};

export default ToolDetailPage;
