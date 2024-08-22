import { User } from "./models/user";
const mongoose = require('mongoose');
const fs = require('fs');

const data = fs.readFileSync('./users.txt', 'utf-8');
const userIds = data.split('\n').map(Number);

export async function importUsers() {
  try {
    for (const userId of userIds) {
      const user = new User({ id: userId });
      await user.save();
      console.log(`Пользователь с ID ${userId} добавлен в базу данных`);
    }
    console.log('Импорт пользователей завершен');
  } catch (error) {
    console.error('Ошибка импорта:', error);
  }
}