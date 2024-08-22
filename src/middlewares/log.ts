import { Middleware } from "grammy";
import { MyContext } from "../typings/context";

export const log: Middleware<MyContext> = async (ctx, next) => {
  //console.log(ctx.myChatMember);
  await next();
} 