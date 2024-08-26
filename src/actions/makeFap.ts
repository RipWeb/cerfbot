import { MyContext } from "../typings/context";
import { User } from "../models/user";

function getRandomNumber() {
  return Math.ceil(Math.random() * 4) + 1;
}

function calcTimeDif(date1: Date, date2: Date) {
  const difference = Math.abs(date2.getTime() - date1.getTime());
  const seconds = Math.floor(difference / 1000) % 60;
  const minutes = Math.floor(difference / (1000 * 60) % 60);
  const hours = Math.floor(difference / (1000 * 60 * 60));

  return hours + "ч " + minutes + "м " + seconds + "с";
}

export default async function makeFap(ctx: MyContext) {
  const user: any = await User.findOne({ id: ctx.from?.id });
  const rank = await User.countDocuments({ dick_len: { $gt: user.dick_len } }) + 1;

  const expDate = new Date(user.last_fap.getTime() + 3 * 60 * 60 * 1000);
  const curDate = new Date();
  const timeDif = calcTimeDif(curDate, expDate);
  const growth = getRandomNumber();
  const resMsg = curDate > expDate || user.charge > 0
    ? ctx.t("growMsg", { name: `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, len: user.dick_len + growth, growth: growth })
    : `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a> не так часто!
cейчас твой писюн <b>${user.dick_len} см.</b>

ты занимаешь <b>${rank} место</b> в топе
следующая попытка через <i>${timeDif}</i>`;
  if (curDate > expDate) {
    await User.updateOne({ id: ctx.from?.id }, { $inc: { dick_len: growth }, $set: { last_fap: curDate } })
  } else if (user.charge > 0) {
    await User.updateOne({ id: ctx.from?.id }, { $inc: { dick_len: growth, charge: -1 } })
  }

  if (ctx.chat?.id)
    await ctx.api.sendMessage(ctx.chat.id, resMsg);
}