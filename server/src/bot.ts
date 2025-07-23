import dotenv from "dotenv";
import TelegramBot from "node-telegram-bot-api";
dotenv.config();

const initBot = () => {
  const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || "", {
    polling: true,
  });

  bot.on("message", async (msg) => {
    const chatId = msg.chat.id;
    const text = msg.text || "О как";

    console.log("ты написал:", text);
    await bot.sendMessage(chatId, text);
  });
};

export default initBot;
