import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { Ref } from "../models/ref";
import { User } from "../models/user";
import { saveDoc } from "../helpers/saveDoc";


export const addRef: Middleware<MyContext> = async (ctx, next) => {
  if (!ctx.message) return next()
  const splitBySpace = ctx.message.text?.split(" ");
  if (!splitBySpace || !splitBySpace[0].includes("/start")) return next()

  await next()

  const [refSystem, refCode] = (splitBySpace[1] || "").split("-");
  if (refSystem === "ref") {
    if (ctx.chat?.type === "private") {
      const date = new Date();
      const count = ctx.session.isFreshUser
        ? 1
        : 0
      ctx.session.isFreshUser = false;

      const ref = await Ref.findOne({ name: refCode });
      if (ref) {
        await Ref.updateOne({ name: refCode }, { $inc: { count }, $set: { lastUsage: date } })
      } else {
        saveDoc(new Ref({
          firstUsage: date,
          lastUsage: date,
          name: refCode,
          count: 1,
        }))
      }
    }
  } else if (refSystem === "group" && (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup")) {
    const isFresh = ctx.session.isFreshGroups?.includes(ctx.chat.id);
    const count = isFresh
    ? 1
    : 0
    ctx.session.isFreshGroups = ctx.session.isFreshGroups?.filter((id) => id !== ctx.chat?.id);
    if (count === 1){
      await User.updateOne({ id: refCode }, { $inc: { group_count: count, charge: 1 } });
      await ctx.api.sendMessage(refCode, "+ 1 попытка");
    }
  }
}
