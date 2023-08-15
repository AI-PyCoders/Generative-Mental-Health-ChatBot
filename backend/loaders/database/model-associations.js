import { CHATS, CHAT_MESSAGES, USERS } from "../../models/index.js";

USERS.hasMany(CHATS, { foreignKey: "user_id", as: "user" });
CHATS.belongsTo(USERS, { foreignKey: "user_id" });

CHATS.hasMany(CHAT_MESSAGES, { foreignKey: "chat_id", as: "messages" });
CHAT_MESSAGES.belongsTo(CHATS, { foreignKey: "chat_id" });
