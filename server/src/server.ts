import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import initBot from "./bot.js";
import routes from "./routes/index.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

const init = async () => {
  app.use(express.json());
  app.use(cors());

  app.use("/api", routes);
  initBot();

  app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
  });
};

init()
  .then(async () => {})
  .catch(async (e) => {
    console.error(e);
    process.exit(1);
  });
