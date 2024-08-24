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
  } else if (ctx.message?.left_chat_member) {
    if (!ctx.message?.left_chat_member?.is_bot)
      console.log(ctx.message?.left_chat_member)
      console.log(ctx.from?.id, ctx.chatId)
      await GroupUser.deleteOne({ user_id: ctx.from?.id, group_id: ctx.chatId })
  }
} 