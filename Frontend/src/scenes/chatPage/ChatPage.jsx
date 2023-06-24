import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Avatar,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  TextField,
  Typography,
  Paper,
  ListItemButton,
  Box,
} from "@mui/material";
import defaultImage from "../../assets/picture-1686621202034-593195804.jpeg";
import Navbar from "scenes/navbar";

import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import ChatBox from "components/ChatBox";
import EmptyChatBox from "components/EmptyChatBox";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
    height: "80vh",
  },
  headBG: {
    backgroundColor: "#e0e0e0",
  },
  borderRight500: {
    borderRight: "1px solid #e0e0e0",
  },
  messageArea: {
    height: "70vh",
    overflowY: "auto",
  },
});

const Chat = () => {
  const dispatch = useDispatch();
  const { palette } = useTheme();
  const token = useSelector((state) => state.auth?.token);
  const [socketConnected, setSocketConnected] = useState(false);
  const [chats, setChats] = useState([]);
  const [isChatSelected, setChatSelected] = useState(true);

  const { id, first_name, last_name } = useSelector((state) => state.auth?.user);
  const classes = useStyles();
  useEffect(() => {
    const ENDPOINT = `http://localhost:3001?userId=${id}`;
    let socket = io(ENDPOINT);
    socket.on("msg_received", (messageData) => {
      console.log("new message received>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>" + JSON.stringify(messageData));
    });
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const getAllChatMessages = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {}, []);

  const createNewChat = async (friendId) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  const getAllMessages = async (chatId) => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box>
      <Navbar />

      <div style={{ padding: "20px" }}>
        <Grid container>
          <Grid item xs={12}>
            <Typography variant="h5" className="header-message">
              Chat
            </Typography>
          </Grid>
        </Grid>
        <Grid container component={Paper} className={classes.chatSection} style={{ padding: "20px", height: "90vh" }}>
          <Grid item xs={3} className={classes.borderRight500}>
            <List>
              <ListItem key="RemySharp">
                <ListItemIcon>
                  <Avatar alt={first_name} src={defaultImage} />
                </ListItemIcon>
                <ListItemText primary={`${first_name} ${last_name}`}></ListItemText>
              </ListItem>
            </List>
            <Divider />

            <Typography color={palette.neutral.dark} variant="h5" marginTop={3} fontWeight="500" sx={{ mb: "1.5rem" }}>
              Chats
            </Typography>

            <List>
              <React.Fragment>
                <List>
                  <ListItem
                    onClick={() => {}}
                    disablePadding
                    sx={{
                      borderRadius: "5px",
                      width: "90%",
                      margin: "0 auto",
                    }}
                  >
                    <ListItemButton>
                      <ListItemIcon>
                        <Avatar alt="Profile Pic" src={defaultImage} />
                      </ListItemIcon>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: 16,
                          fontWeight: "light",
                          letterSpacing: 0,
                          color: "#000000DE",
                        }}
                        primary={"Title of discussion"}
                      />
                    </ListItemButton>
                  </ListItem>
                </List>
              </React.Fragment>
            </List>

            <Divider />
          </Grid>
          {isChatSelected ? (
            <ChatBox
              classes={classes}
              allMessages={[
                { sender: id, message: "Hello" },
                { sender: "343241212", message: "Hi!" },
              ]}
              selectedChat={[]}
              id={id}
            ></ChatBox>
          ) : (
            <Grid item xs={9} display="flex" alignItems="center" justifyContent="center">
              <EmptyChatBox></EmptyChatBox>
            </Grid>
          )}
        </Grid>
      </div>
    </Box>
  );
};

export default Chat;
