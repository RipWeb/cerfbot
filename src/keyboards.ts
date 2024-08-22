import { InlineKeyboard } from "grammy";
import config from "./typings/config";

export const keyboard = new InlineKeyboard()
  .url('😜 Добавить бота в свой чат', `https://t.me/${config.USERNAME}/?startgroup=test`);
