import { InlineKeyboard } from "grammy";
import config from "../typings/config";

export const main_kb = (user_id: number) => {
  return new InlineKeyboard()
  .url('😜 добавить бота в свой чат', `https://t.me/${config.USERNAME}/?startgroup=group-${user_id}`);
}

export const cancel_bc_kb = () => {
  return new InlineKeyboard()
  .text("❌ Отменить", "cancel_bc");
}

export const backup_kb = () => {
  return new InlineKeyboard()
  .text("📩 Выгрузить .txt", "backup");
}
