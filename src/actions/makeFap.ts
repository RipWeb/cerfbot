import { MyContext } from "../typings/context";
import { User } from "../models/user";

function getRandomNumber() {
  return Math.ceil(Math.random() * 4) + 1;
}

export default async function makeFap(ctx: MyContext) {
  const user: any = await User.findOne({ id: ctx.from?.id });
  const rank = await User.countDocuments({ dick_len: { $gt: user.dick_len } }) + 1;
  console.log(rank)

  const expDate = new Date(user.last_fap.getTime() + 24 * 60 * 60 * 1000);
  const curDate = new Date();
  const growth = getRandomNumber();
  const resMsg = curDate > expDate
    ? ctx.t("growMsg", { name: `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, len: user.dick_len + growth, growth: growth })
    : ctx.t("cdMsg", { name: `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, len: user.dick_len, place: rank });
  if (curDate > expDate) {
    await User.updateOne({ id: ctx.from?.id }, { $inc: { dick_len: growth }, $set: { last_fap: curDate } })
  }

  if (ctx.chat?.id)
    await ctx.api.sendMessage(ctx.chat.id, resMsg);
}