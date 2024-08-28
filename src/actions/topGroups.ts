import { MyContext } from "../typings/context";
import { Group } from "../models/group";

export default async function topGroups(ctx: MyContext) {
  const topGroups = await Group.find();
  const group = await Group.findOne({ id: ctx.chat.id })
  .sort({ totalDickLen: -1, _id: 1 })
  .limit(20);
  const rank = await Group.countDocuments({ dick_len: { $gt: group.totalDickLen } }) + 1;

  let text = '<b>топ чатов 💬</b>\n\n';
  for (let i = 0; i < topGroups.length; i++){
    topGroups[i].username
    ? text += `<b>${i + 1}. <a href="https://t.me/${topGroups[i].username}">${topGroups[i].title}</a> | ${topGroups[i].totalDickLen} см.\n</b>`
    : text += `<b>${i + 1}. ${topGroups[i].title} | ${topGroups[i].totalDickLen} см.\n</b>`;
  }
  text += `<b>\nваш чат: \n${rank}. ${group.title} | ${group.totalDickLen} см.\n</b>`;


  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat.id, text, { link_preview_options: { is_disabled: true } })
}