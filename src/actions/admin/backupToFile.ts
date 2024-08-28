import { Group } from "../../models/group";
import { User } from "../../models/user";
import { MyContext } from "../../typings/context";
import { promises as fs } from "fs";


export async function backupToFile(ctx: MyContext) {
  try {
    const users = await User.find({}, { id: 1, _id: 0 });
    const groups = await Group.find({}, { id: 1, _id: 0 });

    const userIds = users.map(user => user.id);
    const groupsIds = groups.map(group => group.id);

    const usersContent = userIds.join('\n');
    let groupsContent = groupsIds.join('\n');
    groupsContent = '\n' + groupsContent;

    await fs.writeFile("./ids.txt", usersContent);
    await fs.appendFile("./ids.txt", groupsContent);
  } catch (error) {
    console.error("Error saving user IDs:", error);
  }
}