import { Server } from "socket.io";
import { USERS } from "../../models/index.js";
var io;
const setupSocket = (server) => {
  try {
    io = new Server(server, { cors: { origin: "*" } });
    io.on("connection", async (socket) => {
      console.log("socket Connected!", socket.handshake.query.userId);
      let userId = socket.handshake.query.userId;
      if (userId) {
        let found = await USERS.findOne({ where: { id: userId } });
        if (found) {
          await found.update({ socket_id: socket.id });
        }
      }
    });
    io.on("connect_failed", (socket) => {
      console.log("socket Connected!", socket);
    });
  } catch (error) {
    throw error;
  }
};

export { setupSocket, io };
