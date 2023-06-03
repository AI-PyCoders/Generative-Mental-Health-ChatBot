import express from "express";
import fs from "fs";
import path from "path";

const { Router } = express;

const router = Router();
(() => {
  fs.readdirSync(path.resolve(`controllers`)).forEach(async (file) => {
    if (file.indexOf(".js") === -1 && file !== ".DS_Store") {
      const controller = await import("../controllers/" + file + "/index.js");
      controller.makeRoutes(router);
    }
  });
})();

export { router };
