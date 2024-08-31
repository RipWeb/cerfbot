import { redis } from ".."


export const warExists = async (user_id: number) => {
  const res = await redis.hgetall(String(user_id));
  if (Object.keys(res).length === 0){
    return false
  }
  return true
}