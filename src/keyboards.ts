import { InlineKeyboard } from "grammy";
import config from "./typings/config";

export const keyboard = (user_id: number) => {
  return new InlineKeyboard()
  .url('😜 добавить бота в свой чат', `https://t.me/${config.USERNAME}/?startgroup=group-${user_id}`);
}

export const cancelBC= () => {
  return new InlineKeyboard()
  .text("❌ отменить", "cancel_bc");
}
