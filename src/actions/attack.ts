import { InputFile } from "grammy";
import { redis } from "..";
import { MyContext } from "../typings/context";

export const attack = async (ctx: MyContext) => {
  if (!(await redis.sismember("turn", ctx.from.id))){
    return await ctx.answerCallbackQuery("Не ваша очередь!");
  }

  const userData = await redis.hgetall(String(ctx.from.id));
  const enemyData = await redis.hgetall(userData.enemyId);

  const user = JSON.parse(userData.userInfo);
  const charUser = JSON.parse(userData.charInfo);
  const enemy = JSON.parse(enemyData.userInfo);
  const charEnemy = JSON.parse(enemyData.charInfo);

  charEnemy.health = charEnemy.health - charUser.damage;

  if (charEnemy.health <= 0){
    await redis.multi()
      .del(user.id)
      .del(enemy.id)
      .srem("turn", user.id)
      .exec()
    
    await ctx.deleteMessage();
    await ctx.api.sendPhoto(user.id, new InputFile(`assets/${user.char_id}.jpg`), { caption: "Победа!" })
    await ctx.api.sendPhoto(enemy.id, new InputFile(`assets/${user.char_id}.jpg`), { caption: "Поражение!" })
    return
  }

  await redis.multi()
  .hset(user.id, { userInfo: JSON.stringify(user) })
  .hset(user.id, { charInfo: JSON.stringify(charUser) })
  .hset(user.id, { enemyId: enemy.id })
  .hset(enemy.id, { userInfo: JSON.stringify(enemy) })
  .hset(enemy.id, { charInfo: JSON.stringify(charEnemy) })
  .hset(enemy.id, { enemyId: user.id })
  .sadd("turn", enemy.id)
  .srem("turn", user.id)
  .exec()
  await ctx.answerCallbackQuery(`Атака! Хп врага: ${charEnemy.health}`)
}