import { Ref } from "../models/ref";
import { User } from "../models/user";
import { MyContext } from "../typings/context";

export default async function profile(ctx: MyContext) {
  const user = await User.findOne({ id: ctx.from?.id });
  const rank = await User.countDocuments({ dick_len: { $gt: user?.dick_len } }) + 1;

  if (ctx.chat && user?.first_name)
    await ctx.api.sendMessage(ctx.chat?.id, ctx.t("profile", { name: user.first_name, rank, dick_len: user.dick_len, charge: user.charge }))
}