import { Send, Edit } from "@mui/icons-material";
import dayjs from "dayjs";
import { Divider, Fab, Grid, List, ListItem, ListItemText, TextField, IconButton } from "@mui/material";
import React, { useEffect, useState, useRef } from "react";

import { useSelector } from "react-redux";

const ChatBox = ({ classes, allMessages, selectedChat, id }) => {
  const token = useSelector((state) => state.token);
  const chatboxRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [messageToEdit, setMessageToEdit] = useState({});

  const [newMessage, setNewMessage] = useState();

  useEffect(() => {
    console.log("rendered", allMessages);
    chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
  }, [allMessages]);


  const sendMessageToAPI = async () => {
    try {
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Grid item xs={9}>
      <List className={classes.messageArea} ref={chatboxRef}>
        {allMessages.length > 0 ? (
          allMessages.map((message) => {
            return (
              <ListItem key={message.id}>
                <Grid container direction="column" className={`message-container ${message.sender === id ? "sender" : "receiver"}`}>
                  <Grid item xs={12}>
                    <ListItemText primary={message.message} />
                  </Grid>
                  <Grid item xs={12} container justifyContent={message.sender == id ? "flex-end" : "flex-start"} alignItems="center">
                    <ListItemText align="right" secondary={message.formattedTime} />
                  </Grid>
                </Grid>
              </ListItem>
            );
          })
        ) : (
          <></>
        )}
      </List>
      <Divider />
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
          <Fab color="primary" aria-label="add" onClick={sendMessageToAPI}>
            <Send />
          </Fab>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default ChatBox;
