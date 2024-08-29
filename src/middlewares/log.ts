import { Middleware } from "grammy";
import { MyContext } from "../typings/context";

export const log: Middleware<MyContext> = async(ctx, next) => {
  // ctx.session.isFreshGroups.push(1)
  // console.log(ctx.session)
  return next();
} 