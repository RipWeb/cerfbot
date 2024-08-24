import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import config from "../typings/config";

export const log: Middleware<MyContext> = async(ctx, next) => {
  // console.log(ctx.message?.left_chat_member);
  return next();
} 