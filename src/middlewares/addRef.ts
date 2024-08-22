import { Middleware } from "grammy";
import { MyContext } from "../typings/context";
import { Ref } from "../models/ref";


export const addRef: Middleware<MyContext> = async (ctx, next) => {
  if (!ctx.message) return next()

  const splitBySpace = ctx.message.text?.split(" ");
  if (!splitBySpace || splitBySpace[0] !== "/start") return next()

  await next()

  const [refSystem, refCode] = (splitBySpace[1] || "").split("-");

  if (refSystem === "ref") {
    const date = new Date();
    const count = ctx.session.isFreshUser
      ? 1
      : 0
    ctx.session.isFreshUser = false;

    const ref = await Ref.findOne({ name: refCode });
    if (ref) {
      await Ref.updateOne(
        { name: refCode },
        {
          $inc: {
            count
          },
          $set: { lastUsage: date }
        }
      )
    } else {
      const newRef = new Ref({
        firstUsage: date,
        lastUsage: date,
        name: refCode,
        count: 1,
      })
      await newRef.save();
    }
  }
}
