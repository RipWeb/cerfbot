import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import config from "../typings/config";

export const isAdmin: Middleware<MyContext> = async(ctx, next) => {
  if (ctx.from) {
    if (config.ADMINS.includes(ctx.from.id)) await next()
      else return
  }
} 