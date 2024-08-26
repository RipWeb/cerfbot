import { Api } from "grammy";
import { Group } from "../models/group";
import { User } from "../models/user";
import { GroupUser } from "../models/groupUser";

export default async function sliceTop(
  api: Api
): Promise<void> {
  const users = await User.find();
  for (const user of users) {
    if(user.first_name)
      if (user.first_name.length > 30){
        await User.updateOne({ id: user.id }, { first_name: user.first_name.slice(0, 30) })
      }
  }

  const groups = await Group.find();
  for (const group of groups) {
    if(group.title)
      if (group.title.length > 30){
        await Group.updateOne({ id: group.id }, { title: group.title.slice(0, 30) })
        console.log(group.title.slice(0, 30));
      }
  }
  console.log('success slice!')
}