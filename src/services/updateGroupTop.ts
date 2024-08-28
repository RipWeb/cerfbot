import { Api } from "grammy";
import { Group } from "../models/group";
import { User } from "../models/user";
import { GroupUser } from "../models/groupUser";

export default async function updateGroupTop(
  api: Api
): Promise<void> {
  // 1. Получение данных из GroupUser:
  const groupUsers = await GroupUser.find().sort({ group_id: -1 });

  // 2. Создание объекта для хранения суммарной "dick_len" для каждой группы:
  const groupDickLens = {};

  // 3. Получение массива пользователей и создание мапы для хранения dick_len для каждого пользователя:
  const users = await User.find(); // Получение массива документов
  const userDickLens = users.reduce((map, user) => {
    map[user.id] = user.dick_len;
    return map;
  }, {});

  // 4. Подсчет суммарной "dick_len" для каждой группы:
  for (const { user_id, group_id } of groupUsers) {
    if (!groupDickLens[group_id]) {
      groupDickLens[group_id] = 0;
    }
    groupDickLens[group_id] += userDickLens[user_id]; // Используем мапу userDickLens для быстрого получения значения
  }

  // 5. Обновление документов Group:
  const updateOperations = Object.entries(groupDickLens).map(([groupId, dickLen]) => ({
    updateOne: {
      filter: { id: parseInt(groupId) },
      update: { $set: { totalDickLen: dickLen } }
    }
  }));

  await Group.bulkWrite(updateOperations);
}
