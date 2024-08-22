import { User } from "../models/user";
import { Group } from "../models/group";
import { MyContext } from "../typings/context";

export default async function myChatMember(ctx: MyContext) {
  const status =
    ctx.myChatMember?.new_chat_member.status !== "left" &&
    ctx.myChatMember?.new_chat_member.status !== "kicked"

  if (ctx.chat?.type === "private")
    return User.updateOne({ id: ctx.from?.id }, { alive: status })
  else if (ctx.chat?.type === "group" || ctx.chat?.type === "supergroup") {
    if (status) await ctx.reply(ctx.t("start"))

    return Group.updateOne({ id: ctx.chat.id }, { alive: status })
  }
}
