import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { User } from "../models/user";
import { Group } from "../models/group";
import { convertChars } from "../helpers/convertChars";

export const updateName: Middleware<MyContext> = async (ctx, next) => {
  let user = await User.findOne({ id: ctx.from?.id });
  let group = await Group.findOne({ id: ctx.chat?.id });
  
  await next();

  if (user?.first_name && user.username){
    if (user.first_name.slice(0, 30) !== ctx.from?.first_name || user.username !== ctx.from.username) {
      await User.updateOne({ id: ctx.from?.id }, 
        { 
          first_name: ctx.from?.first_name.slice(0, 30),
          username: ctx.from?.username
        })
    }
  } else {
    await User.updateOne({ id: ctx.from?.id }, 
      { 
        first_name: convertChars(ctx.from?.first_name.slice(0, 30)),
        username: ctx.from?.username
      })
    }
  
  if (group?.title && ctx.chat?.title)
    if (group.title.slice(0, 30) !== ctx.chat?.title || group.username !== ctx.chat?.username){
      await Group.updateOne({ id: ctx.chat?.id }, 
        { 
          title: convertChars(ctx.chat.title.slice(0, 30)),
          username: ctx.chat.username ? ctx.chat.username : null
        })
    }
} 