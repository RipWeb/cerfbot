import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { GroupUser } from "../models/groupUser";

export const setGroupUser: Middleware<MyContext> = async (ctx, next) => {
  let groupUser = await GroupUser.findOne({ user_id: ctx.from?.id, group_id: ctx.chatId });

  if (!groupUser) {
    const newGroupUser = new GroupUser({
      user_id: ctx.from?.id,
      group_id: ctx.chatId
    })
    await newGroupUser.save();
  }
  await next();
} 