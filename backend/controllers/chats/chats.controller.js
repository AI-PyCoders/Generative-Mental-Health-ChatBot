import { CHATS, CHAT_MESSAGES, USERS } from "../../models/index.js";
import bcrypt from "bcrypt";
import { generateToken } from "../../middlewares/index.js";
import { io } from "../../loaders/socket/index.js";
import { runModel } from "../../loaders/app/python_shell.js";

const getParticularChat = async (req, res) => {
  const { id } = req.params;
  try {
    let chat = await CHATS.findOne({ where: { id: id, is_archived: false } });
    return res.status(200).json({ status: 200, data: chat });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const getParticularUserChat = async (req, res) => {
  const { userId } = req.user;
  try {
    let chat = await CHATS.findOne({ where: { user_id: userId, is_archived: false }, include: [{ model: CHAT_MESSAGES, as: "messages" }] });
    return res.status(200).json({ status: 200, data: chat });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const getParticularUsersAllChats = async (req, res) => {
  const { id } = req.query;
  try {
    let chats = await CHATS.findAll({ where: { user_id: id } });
    return res.status(200).json({ status: 200, data: chats });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const createChatRoom = async (req, res) => {
  const { title } = req.body;
  const { userId } = req.user;
  try {
    let chat = await CHATS.create({ title, user_id: userId });
    return res.status(200).json({ status: 200, data: chat });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

const sendMessage = async (req, res) => {
  const { chat_id, message } = req.body;
  const { userId } = req.user;
  try {
    if (chat_id) {
      let chat = await CHAT_MESSAGES.create({ chat_id, message: message, is_user: true, is_bot: false });
      let socket = await USERS.findOne({ where: { id: userId } });
      io.to(socket.socket_id).emit("message", chat);
      runModel(message)
        .then(async (predictions) => {
          console.log("predictions", predictions);
          io.to(socket.socket_id).emit("typing", { typing: true });
          let botChat = await CHAT_MESSAGES.create({ chat_id, message: predictions, is_user: false, is_bot: true });
          io.to(socket.socket_id).emit("message", botChat);
        })
        .catch((error) => {
          console.error(error);
        });
      return res.status(200).json({ status: 200, data: { message: chat } });
    } else {
      let new_chat = await CHATS.create({ user_id: userId });
      let chat_message = await CHAT_MESSAGES.create({ chat_id: new_chat.id, message: message, is_user: true, is_bot: false });
      let new_chat_detailschat = await CHATS.findOne({ where: { id: new_chat.id }, include: [{ model: CHAT_MESSAGES, as: "messages" }] });
      let socket = await USERS.findOne({ where: { id: userId } });
      runModel(message)
        .then(async (predictions) => {
          console.log("predictions", predictions);
          io.to(socket.socket_id).emit("typing", { typing: true });
          let botChat = await CHAT_MESSAGES.create({ chat_id: new_chat.id, message: predictions, is_user: false, is_bot: true });
          io.to(socket.socket_id).emit("message", botChat);
        })
        .catch((error) => {
          console.error(error);
        });
      return res.status(200).json({ status: 200, data: { message: chat_message, chat_details: new_chat_detailschat } });
    }
  } catch (error) {
    console.log(error);
    return res.status(400).json({ status: 400, data: error, message: error.message });
  }
};

export { getParticularChat, createChatRoom, getParticularUsersAllChats, sendMessage, getParticularUserChat };
