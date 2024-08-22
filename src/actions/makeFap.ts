import { MyContext } from "../typings/context";
import { User } from "../models/user";

function getRandomNumber() {
  return Math.ceil(Math.random() * 4) + 1;
}

export default async function makeFap(ctx: MyContext) {
  const user = await User.findOne({ id: ctx.from?.id });
  const topUsers = await User.find()
    .sort({ dick_len: -1, _id: 1})
  

  if (user){
    let rank = 1;
    for (let i = 0; i < topUsers.length; i++){
      if (user.id === topUsers[i].id){
        break;
      }
      if (user.dick_len > topUsers[i].dick_len){
        break;
      }
      rank++;
    }

    const expDate = new Date(user.last_fap.getTime() + 24 * 60 * 60 * 1000);
    const curDate = new Date();
    const growth = getRandomNumber();
    const resMsg = curDate > expDate
      ? ctx.t("growMsg", { name: `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, len: user.dick_len + growth, growth: growth })
      : ctx.t("cdMsg", { name: `<a href="tg://user?id=${ctx.from?.id}">${ctx.from?.first_name}</a>`, len: user.dick_len, place: rank });
    if (curDate > expDate){
      await User.updateOne({ id: ctx.from?.id }, { $inc: { dick_len: growth }, $set: { last_fap: curDate } })
    }
    
    if (ctx.chat?.id)
      await ctx.api.sendMessage(ctx.chat.id, resMsg);
  }
}