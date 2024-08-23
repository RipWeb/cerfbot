import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { User } from "../models/user";
import { saveDoc } from "../helpers/saveDoc";

export const setUser: Middleware<MyContext> = async (ctx, next) => {
  let user = await User.findOne({ id: ctx.from?.id });
  
  if (!user) {
    let status = true;
    if (ctx.chat?.type !== "private"){
      status = false;
    } else {
      ctx.session.isFreshUser = true;
    }
    await saveDoc(new User({
      id: ctx.from?.id,
      username: ctx.from?.username,
      first_name: ctx.from?.first_name,
      ref_name: ctx.message?.text?.split(" ")[1] || null,
      alive: status
    }));
  } else if (user.alive === false){
    await User.updateOne({ id: ctx.from?.id }, { alive: true })
  }

  return next();
} 