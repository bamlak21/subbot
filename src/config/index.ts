import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 1111,
  mongoURI:
    process.env.MONGO_URI ||
    (() => {
      throw new Error("MONGO_URI is missing in .env");
    })(),
  bot:
    process.env.BOT_TOKEN ||
    (() => {
      throw new Error("BOT token is missing in .env");
    })(),
  paymentToken:
    process.env.CHAPA_PROVIDER_TOKEN ||
    (() => {
      throw new Error("Provider token missing in .env");
    })(),
};
