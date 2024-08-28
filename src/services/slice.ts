import { Api } from "grammy";
import { Group } from "../models/group";
import { User } from "../models/user";
import { convertChars } from "../helpers/convertChars";

export default async function sliceTop(): Promise<void> {
  const users = await User.find();
  for (const user of users) {
    if(user.first_name)
      if (user.first_name.includes("<") || user.first_name.includes(">")){
        await User.updateOne({ id: user.id }, { first_name: convertChars(user.first_name.slice(0, 25)) })
      }
  }

  const groups = await Group.find();
  for (const group of groups) {
    if(group.title)
      if (group.title.includes("<") || group.title.includes(">")){
        await Group.updateOne({ id: group.id }, { title: convertChars(group.title.slice(0, 25)) })
      }
  }
  console.log('success slice!')
}