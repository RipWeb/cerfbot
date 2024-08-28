import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { Group } from "../models/group";
import { saveDoc } from "../helpers/saveDoc";
import { convertChars } from "../helpers/convertChars";

export const setGroup: Middleware<MyContext> = async (ctx, next) => {
  let group = await Group.findOne({ id: ctx.chatId });

  if (!group) {
    if (ctx.chatId)
      ctx.session.isFreshGroups?.push(ctx.chatId);
    await saveDoc(new Group({
      id: ctx.chatId,
      username: ctx.chat?.username,
      title: convertChars(ctx.chat?.title?.slice(0, 25))
    }))
  }
  
  return next();
} 