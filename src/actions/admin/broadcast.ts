import { cancelBC } from "../../keyboards";
import { User } from "../../models/user";
import { MyContext } from "../../typings/context";
import { Conversation } from "@grammyjs/conversations"

let isAllowed = true;

async function broadcast(ctx: MyContext, message_id: number) {
  if (ctx.chat && ctx.from){
    const users = await User.find({ alive: true });
    let count = 0;
    let reject = 0;
    const mes = await ctx.api.sendMessage(ctx.chat.id, `Рассылка началась!\n\nОтправлено: ${count}`, { reply_markup: cancelBC() })
      for (const user of users){
          if (isAllowed){
            count++;
            if (count % 500 === 0){
              await ctx.api.editMessageText(ctx.chat.id, mes.message_id, `Рассылка идет!\n\nОтправлено: ${count}`, { reply_markup: cancelBC() })
            }
            try {
              await ctx.api.copyMessage(user.id, ctx.from.id, message_id);
            } catch (error) {
              reject++;
            }
          } else {
            isAllowed = true;
            break;
          }
      }
      await ctx.api.editMessageText(ctx.chat.id, mes.message_id, `Рассылка завершилась!\n\nОтправлено: ${count}\nОшибок: ${reject}`)
  }
}

export async function broadcastConservation(
  conversation: Conversation<MyContext>,
  ctx: MyContext
) {
  await ctx.reply("Отправьте сообщение для рассылки:");
  const { message } = await conversation.waitFor("message")
  broadcast(ctx, message.message_id);
}

export async function cancel_bc(ctx: MyContext) {
  isAllowed = false;
}