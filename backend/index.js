import express from "express";
import { appLoader, databaseLoader } from "./loaders/index.js";
import { router } from "./routers/index.js";

process.on("uncaughtException", (err) => {
  console.log(" UNCAUGHT EXCEPTION ");
  console.log("[Inside 'uncaughtException' event] " + err.stack || err.message, err);
});

process.on("unhandledRejection",(reason, promise) => {
  console.log(" UNHANDLED REJECTION ");
  console.log("Unhandled Rejection at: ", promise, "REASON: ", reason);
});

const app = express();

databaseLoader()
  .then(async () => {
    await appLoader(app, router);
  })
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
