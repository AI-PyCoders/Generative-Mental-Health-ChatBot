import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import background from "../../assets/psychiatrist.jpeg";
const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box style={{ backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: "cover",height:'100%' }}>
      <Box width="100%" backgroundColor={theme.palette.background.alt} p="1rem 6%" textAlign="center">
        <Typography fontWeight="bold" fontSize="32px" color="primary">
          Virtual Psychiatrist
        </Typography>
      </Box>

      <Box
        width={isNonMobileScreens ? "35%" : "93%"}
        p="4rem"
        m="5rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography align="center" fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to Virtual Psychiatrist!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
