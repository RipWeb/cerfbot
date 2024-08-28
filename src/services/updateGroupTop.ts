import { Api } from "grammy";
import { Group } from "../models/group";
import { User } from "../models/user";
import { GroupUser } from "../models/groupUser";

export default async function updateGroupTop(
  api: Api
): Promise<void> {
  const start: any = new Date()
  const groupUsers = await GroupUser.find().sort({ group_id: -1 });

  const result: any = {};

  for (const item of groupUsers) {
    const { user_id, group_id } = item;
  
    if (!result[group_id]) {
      result[group_id] = [];
    }
  
    result[group_id].push(user_id);
  }
  const users = await User.find();
  for (const key in result) {
    for (let i = 0; i < result[key].length; i++){
      for (const item of users){
        if (result[key][i] === item.id){
          result[key][i] = item.dick_len;
        }
      }
    }
  }
  
  for (const key in result) {
    const total = result[key].reduce(
      (acc: number, cur: number) => acc + cur,
      0,
    );
    result[key] = total;
  }

  const updateOperations = Object.entries(result).map(([groupId, dickLen]) => ({
    updateOne: {
      filter: { id: parseInt(groupId) },
      update: { $set: { totalDickLen: dickLen } }
    }
  }));

  await Group.bulkWrite(updateOperations);
  const end: any = new Date();
  console.log("Time:", end - start);

}