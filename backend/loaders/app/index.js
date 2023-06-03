import express from "express";
import { createServer } from "http";
import cors from "cors";
import logger from "morgan";
import cookieParser from "cookie-parser";
const PORT = Number(process.env.PORT) || 3000;
const appLoader = async (app, router) =>
  new Promise(async (resolve) => {
    const server = createServer(app);

    app.use(function (req, res, next) {
      res.setHeader("version", process.env.VERIONS);
      next();
    });

    app.use(logger("dev"));
    app.use(cookieParser());
    app.use(cors({ exposedHeaders: ["Content-Range", "X-Content-Range", "version", "Content-Disposition"] }));
    app.use(express.json({}));
    app.use(
      express.urlencoded({
        extended: true,
      })
    );

    app.use("/api", router);
    app.get("/health-check", (req, res) => res.status(200).send(""));

    server.listen(PORT, () => {
      console.log(`App is running on port ${PORT}`);
      resolve(true);
    });
  });

export { appLoader };
