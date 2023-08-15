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
  IconButton,
} from "@mui/material";
import defaultImage from "../../assets/picture-1686621202034-593195804.jpeg";
import Navbar from "scenes/navbar";
import CommentIcon from "@mui/icons-material/Comment";
import { useDispatch, useSelector } from "react-redux";
import { useTheme } from "@emotion/react";
import { useEffect } from "react";
import { useState } from "react";
import io from "socket.io-client";
import ChatBox from "components/ChatBox";
import EmptyChatBox from "components/EmptyChatBox";
import axios from "axios";
import background from "../../assets/psychiatrist.jpeg";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  chatSection: {
    width: "100%",
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
  const [chatDetails, setChatDetails] = useState(null);
  const [allMessages, setAllMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const { id } = useSelector((state) => state.auth?.user);
  const classes = useStyles();
  const [boatLoading, setBoatLoading] = useState(false);

  useEffect(() => {
    const ENDPOINT = `${process.env.REACT_APP_SOCKET_URL}?userId=${id}`;
    let socket = io(ENDPOINT);
    const addMessage = (msg) => {
      setBoatLoading(false);
      setAllMessages((prevMessages) => [...prevMessages, msg]);
    };
    socket.on("message", addMessage);
    socket.on("connected", () => setSocketConnected(true));
  }, []);

  const getChatIFExist = async () => {
    try {
      let data = await axios.get(`${process.env.REACT_APP_API_URL}/chats/logged-in-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (data.status == 200) {
        let chat_details = data.data.data;
        if (chat_details) {
          setChatDetails(chat_details);
          setAllMessages(chat_details.messages);
          setLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getChatIFExist();
  }, []);

  return (
    <Box style={{ height: "100vh", backgroundImage: `url(${background})`, backgroundRepeat: "no-repeat", backgroundSize: "auto 100%" }}>
      <Navbar />

      <Grid
        container
        justifyContent={"center"}
        style={{
          padding: "20px",
        }}
      >
        <ChatBox
          classes={classes}
          chatDetails={chatDetails}
          setChatDetails={setChatDetails}
          allMessages={allMessages}
          setAllMessages={setAllMessages}
          selectedChat={[]}
          id={id}
          loading={loading}
          boatLoading={boatLoading}
          setBoatLoading={setBoatLoading}
        ></ChatBox>
      </Grid>
    </Box>
  );
};

export default Chat;
