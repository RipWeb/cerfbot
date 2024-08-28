import { MyContext } from "../typings/context";
import { User } from "../models/user";

export default async function topUsers(ctx: MyContext) {
  const topUsers = await User.find()
    .sort({ dick_len: -1, _id: 1 })
    .limit(20);

  const user = await User.findOne({ id: ctx.from?.id });
  const bdick = await User.countDocuments({ dick_len: { $gt: user.dick_len } });
  const sdick = await User.countDocuments({ dick_len: user.dick_len, _id: { $lte: user._id } });
  const rank = bdick + sdick;

  let text = '<b>топ пипис 🐹</b>\n\n';
  for (let i = 0; i < topUsers.length; i++) {
    text += `<b>${i + 1}. <a href="tg://openmessage?user_id=${topUsers[i].id}">${topUsers[i].first_name}</a> | ${topUsers[i].dick_len} см.</b>\n`;
  }
  text += `\n<b>Вы: \n${rank}. <a href="tg://user?id=${user.id}">${user.first_name}</a> | ${user.dick_len} см.</b>`;

  if (ctx.chat) {
    await ctx.api.sendMessage(ctx.chat.id, text);
  }
}
