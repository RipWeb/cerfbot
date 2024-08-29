import { MyContext } from "../typings/context";
import { GroupUser } from "../models/groupUser";
import { User } from "../models/user";

export default async function topGroupUsers(ctx: MyContext) {
  const res = await GroupUser.find({ group_id: ctx.chatId })
  const GroupUsers : any = [];

  for (let i = 0; i < res.length; i++) {
    GroupUsers.push(res[i].user_id);
  }

  const topUsers = await User.find({ id: { $in: GroupUsers }})    
    .sort({ dick_len: -1, _id: 1 })
    .limit(20);

  let text = '<b>топ чата 🐭</b>\n\n';
  for (let i = 0; i < topUsers.length; i++){
    text += `<b>${i + 1}. <a href="tg://openmessage?user_id=${topUsers[i].id}">${topUsers[i].first_name}</a> | ${topUsers[i].dick_len} см.\n</b>`;
  }
  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat.id, text)
}