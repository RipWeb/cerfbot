import { Group } from "../../models/group";
import { User } from "../../models/user";
import { MyContext } from "../../typings/context";

export default async function stat(ctx: MyContext) {
  const users = await User.countDocuments();
  const usersAlive = await User.countDocuments({ alive: true })
  const groups = await Group.countDocuments();
  const groupsAlive = await Group.countDocuments({ alive: true });
  if (ctx.chat)
    await ctx.api.sendMessage(ctx.chat?.id, `<b>Статистика:</b>
  
Юзеров: ${users}
живых: ${usersAlive}
мертвых: ${users - usersAlive}

Групп: ${groups}
живых: ${groupsAlive}
мертвых: ${groups - groupsAlive}`);
}