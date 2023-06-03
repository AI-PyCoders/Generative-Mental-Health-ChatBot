import Sequelize from "sequelize";
import dotenv from "dotenv";
import path from "path";

if (process.env.NODE_ENV === "dev") {
  console.log("Development");
  dotenv.config({
    debug: process.env.DEBUG,
    path: path.normalize("./.env.dev"),
  });
} else {
  console.log("Production");
  dotenv.config({
    debug: process.env.DEBUG,
    path: path.normalize("./.env.prod"),
  });
}

let sequelize;

if (process.env.NODE_ENV === "prod_do") {
  const dbConfig = {
    dialect: "mysql",
    dialectOptions: {
      multipleStatements: true,
      supportBigNumbers: true,
    },
    logging: false,
  };
  sequelize = new Sequelize(process.env.DB_STRING, dbConfig);
} else {
  let dbConfig = {
    dialect: "mysql",
    database: process.env.DB_DATABASE,
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    dialectOptions: {
      multipleStatements: true,
    },
    logging: false,
  };
  sequelize = new Sequelize(dbConfig);
}

const databaseLoader = async () =>
  new Promise(async (resolve, reject) => {
    sequelize
      .authenticate()
      .then(async (db) => {
        console.log("Database connection established");
        resolve(db);
      })
      .catch(reject);
    //--------called associations for models before sync-----
    await import("./model-associations.js");

    sequelize
      .sync()
      .then(() => {
        console.log("Database synced");
      })
      .catch(e =>{
        console.log(e);
      });
  });

export { databaseLoader, sequelize };

