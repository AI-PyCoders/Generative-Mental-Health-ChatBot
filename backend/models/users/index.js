import Sequelize from "sequelize";
const { DataTypes } = Sequelize;
import { sequelize } from "../../loaders/index.js";
import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);
const USERS = sequelize.define(
  "users",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    first_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    last_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    full_name: {
      type: DataTypes.STRING(105),
      allowNull: false,
    },
    phone: {
      type: DataTypes.STRING(20),
      allowNull: true,
    },
    email: {
      type: DataTypes.STRING(80),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    socket_id: {
      type: DataTypes.STRING(80),
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "others"),
    },
    is_deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    last_login: {
      type: DataTypes.DATE,
    },
    token: {
      type: DataTypes.TEXT,
    },
  },
  {
    freezeTableName: true,
    paranoid: true,
    timestamps: true,
  }
);
USERS.beforeSave((user, options) => {
  if (user.changed("password")) {
    return bcrypt
      .hash(user.password, salt)
      .then((hash) => {
        user.password = hash;
      })
      .catch((err) => console.log(err));
  }
});
export { USERS };
