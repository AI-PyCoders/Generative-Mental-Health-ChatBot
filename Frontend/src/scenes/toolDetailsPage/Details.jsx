import { Box, Button, Grid, TextField, Typography, useMediaQuery, useTheme } from "@mui/material";
import UserImage from "components/UserImage";
import { useEffect, useState } from "react";
import * as actions from "../../state/tools/toolActions";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CustomModal from "components/CustomModal";
import { DateRangePicker } from "react-date-range";
import moment from "moment";

const Details = () => {
  const isNonMobileScreens = useMediaQuery("(min-width:1000px)");
  const token = useSelector((state) => state.auth?.token);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [tool, setTool] = useState(null);
  const [open, setOpen] = useState(false);
  const [lendingDetails, setLendingDetails] = useState(null);
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: "selection",
  });
  const { palette } = useTheme();
  useEffect(() => {
    dispatch(actions.fetchParticularTool(id, token)).then((data) => {
      if (data.success) {
        setTool(data.data);
      }
    });
    fetchLendings();
  }, [id]);
  const fetchLendings = () => {
    dispatch(actions.getLendingByToolId(id, token)).then((data) => {
      if (data.success) {
        setLendingDetails(data.data);
      }
    });
  };

  const handleSelect = (ranges) => {
    setSelectionRange(ranges.selection);
  };
  const onSubmitModal = () => {
    if (selectionRange.startDate && selectionRange.endDate) {
      dispatch(
        actions.borrowTool(
          {
            tool: id,
            startDate: moment(selectionRange.startDate).format("YYYY-MM-DD"),
            endDate: moment(selectionRange.endDate).format("YYYY-MM-DD"),
          },
          token
        )
      ).then((data) => {
        if (data.success) {
          fetchLendings();
          setSelectionRange({
            startDate: new Date(),
            endDate: new Date(),
            key: "selection",
          });
          setOpen(false);
        }
      });
    }
  };

  return (
    tool && (
      <Box width="100%"  display={isNonMobileScreens ? "flex" : "block"} gap="0.5rem" justifyContent="space-between">
        <Box flexBasis={isNonMobileScreens ? "30%" : undefined} margin={"20px"}>
          <Grid container spacing={2}>
            {tool.images.map((img) => {
              return (
                <Grid item md={6}>
                  <UserImage image={img} size="60px" />
                </Grid>
              );
              // return ;
            })}
          </Grid>
        </Box>
        <Box flexBasis={isNonMobileScreens ? "70%" : undefined} >
          <Box
            display="grid"
            gap="30px"
            gridTemplateColumns="repeat(4, minmax(0, 1fr))"
            sx={{
              "& > div": { gridColumn: isNonMobileScreens ? undefined : "span 4" },
            }}
          >
            <TextField label="Maker" value={tool.maker} name="maker" sx={{ gridColumn: "span 2" }} />
            <TextField label="Model" value={tool.model} name="model" sx={{ gridColumn: "span 2" }} />
            <TextField label="Short Description" value={tool.shortDescription} name="shortDescription" sx={{ gridColumn: "span 4" }} />
            <TextField
              label="Long Description"
              multiline
              rows={3}
              value={tool.longDescription}
              name="longDescription"
              sx={{ gridColumn: "span 4" }}
            />
          </Box>
          <Box textAlign={"center"}>
            <Button
              type="submit"
              sx={{
                m: "2rem 0",
                p: "1rem 2rem",
                backgroundColor: palette.primary.main,
                color: palette.background.alt,
                "&:hover": { color: palette.primary.main },
              }}
              onClick={() => {
                setOpen(true);
              }}
            >
              Borrow
            </Button>
          </Box>
        </Box>
        <CustomModal
          setOpen={setOpen}
          open={open}
          title={"Borrow Tool"}
          childComponent={
            <Box alignItems={"center"}>
              <DateRangePicker
                ranges={[selectionRange]}
                onChange={handleSelect}
                minDate={new Date()}
                staticRanges={[]}
                disabledDates={
                  lendingDetails?.blockedDates.map((blackDate) => {
                    return moment(blackDate).toDate();
                  }) || []
                }
              />
            </Box>
          }
          onSubmit={(e) => onSubmitModal()}
        />
      </Box>
    )
  );
};

export default Details;
