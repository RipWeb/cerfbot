import { InlineKeyboard, Keyboard } from "grammy";
import config from "../typings/config";

export const main_kb = (user_id: number) => {
  return new InlineKeyboard()
  .url('😜 добавить бота в свой чат', `https://t.me/${config.USERNAME}/?startgroup=group-${user_id}`);
}

export const menu_kb = () => {
  return new Keyboard()
  .text('🎯 В бой').row()
  .text('🎭 Бойцы')
  .text('🗃️ Лавка').row()
  .text('🔰 Профиль')
  .text('🏆 Топ')
  .resized()
}

export const cancel_bc_kb = () => {
  return new InlineKeyboard()
  .text("❌ Отменить", "cancel_bc");
}

export const attack_kb = () => {
  return new InlineKeyboard()
  .text("Атаковать ⚔️", "attack");
}

export const cancel_search_kb = () => {
  return new InlineKeyboard()
  .text("❌ Отменить поиск", "cancel_search");
}


export const backup_kb = () => {
  return new InlineKeyboard()
  .text("📩 Выгрузить .txt", "backup");
}
