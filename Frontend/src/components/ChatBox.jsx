import { Send, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import { Divider, Fab, Grid, List, ListItem, ListItemText, TextField, IconButton, Box, Typography, Paper } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

import { useSelector } from "react-redux";
import axios from "axios";
import BouncingDotsLoader from "./BouncingLoader";
import moment from "moment";

const ChatBox = ({ classes, allMessages, setBoatLoading, boatLoading, chatDetails, setChatDetails, id, setAllMessages, loading }) => {
  const token = useSelector((state) => state.auth?.token);
  const chatboxRef = useRef(null);

  const [newMessage, setNewMessage] = useState();

  useEffect(() => {
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [allMessages]);

  const sendMessageToAPI = async (e) => {
    e.preventDefault();
    try {
      let data = await axios.post(
        `${process.env.REACT_APP_API_URL}/chats/send-message`,
        { message: newMessage, chat_id: chatDetails?.id },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      if (data.status == 200) {
        setNewMessage("");
        setBoatLoading(true);
        setTimeout(() => {
          chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
        }, 1000);

        if (data.data?.data.chat_details) {
          setChatDetails(data.data.data.chat_details);
          setAllMessages(data.data.data.chat_details.messages);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid item xs={10} md={10} lg={8} component={Paper} className={classes.chatSection}>
      <List className={classes.messageArea} ref={chatboxRef}>
        {allMessages.length > 0 ? (
          <>
            {allMessages.map((message) => {
              return (
                <ListItem key={message.id}>
                  <Grid container direction="column" className={`message-container ${message.is_user ? "sender" : "receiver"}`}>
                    <Grid item xs={12}>
                      <ListItemText primary={message.message.replace("<end>", ".")} />
                    </Grid>
                    <Grid item xs={12} container justifyContent={message.is_user ? "flex-end" : "flex-start"} alignItems="center">
                      <ListItemText
                        align="right"
                        secondary={moment(message.createdAt).fromNow()}
                        secondaryTypographyProps={{ style: { color: "black" } }}
                      />
                    </Grid>
                  </Grid>
                </ListItem>
              );
            })}
            {boatLoading && (
              <ListItem>
                <Grid style={{ display: "flex", alignItems: "center", height: "50px" }}>
                  <ListItemText primary={"Bot is typing"} style={{ marginRight: "10px" }} />
                  <BouncingDotsLoader />
                </Grid>
              </ListItem>
            )}
          </>
        ) : (
          !loading && (
            <Box display="flex" alignItems="center" justifyContent="center">
              <Typography variant="h3" className="header-message">
                Send a message to start the chat
              </Typography>
            </Box>
          )
        )}
      </List>

      <Divider />
      <form>
        <Grid container style={{ padding: "20px" }}>
          <Grid item xs={11}>
            <TextField
              id="outlined-basic-email"
              label="Type Something"
              fullWidth
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </Grid>
          <Grid xs={1} align="right">
            <Fab color="primary" aria-label="add" type="submit" onClick={sendMessageToAPI}>
              <Send />
            </Fab>
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default ChatBox;
