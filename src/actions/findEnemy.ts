import { InputFile } from "grammy";
import { User } from "../models/user";
import { MyContext } from "../typings/context";
import { UserChar } from "../models/userChar";
import { redis } from "..";
import { warExists } from "../helpers/warExists";
import { attack_kb, cancel_search_kb } from "../helpers/keyboards";

export default async function findEnemy(ctx: MyContext) {

  if ((await warExists(ctx.from.id))) {
    return await ctx.api.sendMessage(ctx.from.id, "<b>Вы уже в бою!</b>")
  }

  const user = await User.findOne({ id: ctx.from.id });

  const opponent = await redis.zrangebyscore("queue", 0, 10, "LIMIT", 0, 1);
  if (opponent.length === 0 || opponent[0] == user.id) {
    if (!(await redis.zscore("queue", user.id))){
      await redis.zadd("queue", `${user.rating}`, `${user.id}`);
      await ctx.api.sendSticker(ctx.from.id, "CAACAgEAAxkBAAEMva9m02GG4oWjH7bZJlI2YOK3l7BoXAACxQIAAkeAGUTTk7G7rIZ7GjUE", { reply_markup: cancel_search_kb() })
    } else {
      await ctx.api.sendMessage(ctx.from.id, "<b>Вы уже ищите бой!</b>", { reply_markup: cancel_search_kb() })
    }
  } else {
    await redis.zrem("queue", user.id, opponent[0])
    const enemy = await User.findOne({ id: opponent[0] });
    const charUser = await UserChar.findOne({ user_id: user.id, char_id: user.char_id });
    const charEnemy = await UserChar.findOne({ user_id: enemy.id, char_id: enemy.char_id });
    const data = {
      user: {
        name: user.first_name,
        rating: user.rating,
        char_name: charUser.name,
        health: charUser.health,
        damage: charUser.damage,
        armor: charUser.armor
      },
      enemy: {
        name: enemy.first_name,
        rating: enemy.rating,
        char_name: charEnemy.name,
        health: charEnemy.health,
        damage: charEnemy.damage,
        armor: charEnemy.armor
      }
    }
    await redis.multi()
      .hset(user.id, { userInfo: JSON.stringify(user) })
      .hset(user.id, { charInfo: JSON.stringify(charUser) })
      .hset(user.id, { enemyId: enemy.id })
      .hset(enemy.id, { userInfo: JSON.stringify(enemy) })
      .hset(enemy.id, { charInfo: JSON.stringify(charEnemy) })
      .hset(enemy.id, { enemyId: user.id })
      .sadd("turn", user.id)
      .exec();
    const msg1 = await ctx.api.sendPhoto(user.id, new InputFile(`assets/${user.char_id}.jpg`), { caption: ctx.t("fight", data.user), reply_markup: attack_kb() })
    const msg2 = await ctx.api.sendPhoto(enemy.id, new InputFile(`assets/${user.char_id}.jpg`), { caption: ctx.t("fight", data.enemy), reply_markup: attack_kb() })
    await redis.multi()
      .hset(user.id, { msgId: msg1.message_id })
      .hset(enemy.id, { msgId: msg2.message_id })
      .exec();
  }
}

export const cancel_search = async (ctx: MyContext) => {
  await redis.zrem("queue", ctx.from.id);
  await ctx.deleteMessage();
}