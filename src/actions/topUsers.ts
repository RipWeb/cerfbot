import { MyContext } from "../typings/context";
import { User } from "../models/user";

export default async function topUsers(ctx: MyContext) {
  const topUsers = await User.find()
    .sort({ dick_len: -1, _id: 1 });
    const user = await User.findOne({ id: ctx.from?.id });

  let text = '<b>Топ пипис 🌟</b>\n\n';
  for (let i = 0; i < topUsers.slice(0, 10).length; i++){
    text += `<b>${i + 1}. <a href="tg://user?id=${topUsers[i].id}">${topUsers[i].first_name}</a> | ${topUsers[i].dick_len} см. \n</b>`;
  }

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
    text += `<b>\nВы: \n${rank}. <a href="tg://user?id=${user.id}">${user.first_name}</a> | ${user.dick_len} см. \n</b>`;
  }

  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat.id, text)
}