import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { GroupUser } from "../models/groupUser";
import { saveDoc } from "../helpers/saveDoc";

export const setGroupUser: Middleware<MyContext> = async (ctx, next) => {
  let groupUser = await GroupUser.findOne({ user_id: ctx.from?.id, group_id: ctx.chatId });

  await next();
  
  if (!groupUser) {
    saveDoc(new GroupUser({
      user_id: ctx.from?.id,
      group_id: ctx.chatId
    }))
  }
} 