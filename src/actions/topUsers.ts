import { MyContext } from "../typings/context";
import { User } from "../models/user";

export default async function topUsers(ctx: MyContext) {
  const topUsers = await User.find()
    .sort({ dick_len: -1, _id: 1 })
    .limit(10);
  const user: any = await User.findOne({ id: ctx.from?.id });
  const rank = await User.countDocuments({ dick_len: { $gt: user.dick_len } }) + 1;

  let text = '<b>Топ пипис 🌟</b>\n\n';
  for (let i = 0; i < topUsers.length; i++){
    text += `<b>${i + 1}. <a href="tg://openmessage?user_id=${topUsers[i].id}">${topUsers[i].first_name}</a> | ${topUsers[i].dick_len} см. \n</b>`;
  }
  text += `<b>\nВы: \n${rank}. <a href="tg://user?id=${user.id}">${user.first_name}</a> | ${user.dick_len} см. \n</b>`;

  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat.id, text)
}