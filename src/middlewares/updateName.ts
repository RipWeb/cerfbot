import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { User } from "../models/user";

export const updateName: Middleware<MyContext> = async (ctx, next) => {
  let user = await User.findOne({ id: ctx.from?.id });
  
  if (!user?.first_name) {
    await User.updateOne({ id: ctx.from?.id }, 
      { first_name: ctx.from?.first_name,
        username: ctx.from?.username
       })
  }

  await next();
} 