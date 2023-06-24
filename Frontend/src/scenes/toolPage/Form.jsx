import { useEffect, useState } from "react";
import { Box, Button, TextField, useMediaQuery, Typography, useTheme } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import { Formik } from "formik";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLogin } from "state";
import Dropzone from "react-dropzone";
import FlexBetween from "components/FlexBetween";
import * as actions from "../../state/tools/toolActions";

const toolSchema = yup.object().shape({
  maker: yup.string().required("*required"),
  model: yup.string().required("*required"),
  longDescription: yup.string().required("*required"),
  shortDescription: yup.string().required("*required").max(50),
  images: yup.array().min(1, "*please upload atleast 1 image"),
});

const initialValuesTool = {
  maker: "",
  model: "",
  shortDescription: "",
  longDescription: "",
  images: [],
};

const Form = () => {
  const { palette } = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width:600px)");
  const token = useSelector((state) => state.auth?.token);
  const handleFormSubmit = async (values, onSubmitProps) => {
    dispatch(actions.addNewTool(values, token)).then(success =>{
      if(success){
        navigate("/home")
      }
    });
  };

  return (
    <Formik onSubmit={handleFormSubmit} initialValues={initialValuesTool} validationSchema={toolSchema}>
      {({ values, errors, touched, handleBlur, handleChange, handleSubmit, setFieldValue, resetForm }) => (
        <form onSubmit={handleSubmit}>
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
            }}
          >
            <TextField
              label="Maker"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.maker}
              name="maker"
              error={Boolean(touched.maker) && Boolean(errors.maker)}
              helperText={touched.maker && errors.maker}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Model"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.model}
              name="model"
              error={Boolean(touched.model) && Boolean(errors.model)}
              helperText={touched.model && errors.model}
              sx={{ gridColumn: "span 2" }}
            />
            <TextField
              label="Short Description"
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.shortDescription}
              name="shortDescription"
              error={Boolean(touched.shortDescription) && Boolean(errors.shortDescription)}
              helperText={touched.shortDescription && errors.shortDescription}
              sx={{ gridColumn: "span 4" }}
            />
            <TextField
              label="Long Description"
              multiline
              rows={3}
              onBlur={handleBlur}
              onChange={handleChange}
              value={values.longDescription}
              name="longDescription"
              error={Boolean(touched.longDescription) && Boolean(errors.longDescription)}
              helperText={touched.longDescription && errors.longDescription}
              sx={{ gridColumn: "span 4" }}
            />
            <Box gridColumn="span 4" border={`1px solid ${palette.neutral.medium}`} borderRadius="5px" p="1rem">
              <Dropzone maxFiles={10} acceptedFiles=".jpg,.jpeg,.png" multiple={true} onDrop={(acceptedFiles) => setFieldValue("images", acceptedFiles)}>
                {({ getRootProps, getInputProps }) => (
                  <Box {...getRootProps()} border={`2px dashed ${palette.primary.main}`} p="1rem" sx={{ "&:hover": { cursor: "pointer" } }}>
                    <input {...getInputProps()} />
                    {!values.images.length ? (
                      <p>Add Images Here</p>
                    ) : (
                      values.images.map((pic) => {
                        return (
                          <FlexBetween>
                            <Typography>{pic.name}</Typography>
                            <EditOutlinedIcon />
                          </FlexBetween>
                        );
                      })
                    )}
                  </Box>
                )}
              </Dropzone>
            </Box>
          </Box>

          {/* BUTTONS */}
          <Box textAlign={"center"}>
            <Button
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem 4rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
            >
              Save
            </Button>
          </Box>
        </form>
      )}
    </Formik>
  );
};

export default Form;
