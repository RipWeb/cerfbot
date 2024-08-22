import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { Group } from "../models/group";

export const setGroup: Middleware<MyContext> = async (ctx, next) => {
  let group = await Group.findOne({ id: ctx.chatId }).exec();

  if (!group) {
    const newGroup = new Group({
      id: ctx.chatId,
      username: ctx.chat?.username,
      title: ctx.chat?.title
    })
    await newGroup.save();
  }
  await next();
} 