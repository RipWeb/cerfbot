import { MyContext } from "../typings/context";
import { Group } from "../models/group";

export default async function topGroups(ctx: MyContext) {
  const topGroups = await Group.find()
  .sort({ totalDickLen: -1, _id: 1 })
  .limit(10);

  let text = '<b>топ чатов 💬</b>\n\n';
  for (let i = 0; i < topGroups.length; i++){
    topGroups[i].username
    ? text += `<b>${i + 1}. <a href="https://t.me/${topGroups[i].username}">${topGroups[i].title}</a> | ${topGroups[i].totalDickLen} см.\n</b>`
    : text += `<b>${i + 1}. ${topGroups[i].title} | ${topGroups[i].totalDickLen} см.\n</b>`;
  }

  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat.id, text, { link_preview_options: { is_disabled: true } })
}