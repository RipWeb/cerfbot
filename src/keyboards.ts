import { InlineKeyboard } from "grammy";
import config from "./typings/config";

export const keyboard = (user_id: number) => {
  return new InlineKeyboard()
  .url('😜 Добавить бота в свой чат', `https://t.me/${config.USERNAME}/?startgroup=group-${user_id}`);
}
