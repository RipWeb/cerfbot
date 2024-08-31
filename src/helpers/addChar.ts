import { Char } from "../models/char";
import { User } from "../models/user";
import { UserChar } from "../models/userChar"
import { saveDoc } from "./saveDoc";

export const addChar = async (user_id: number, char_id: number) => {
  const char = await UserChar.findOne({ user_id, char_id });
  if (!char) {
    const charInfo = await Char.findOne({ id: char_id });
    await saveDoc(new UserChar({
      user_id,
      char_id,
      name: charInfo.name,
      health: charInfo.health,
      damage: charInfo.damage,
      armor: charInfo.armor
    }))
    await User.updateOne({ id: user_id }, { $set: { char_id }});
  }
}