import 'dotenv/config';
import { z } from "zod";

const configSchema = z.object({
  TOKEN: z.string(),
  URI: z.string(),
  USERNAME: z.string(),
  ADMINS: z.string().transform((str) => str.split(' ').map(str => Number(str)))
})

export default configSchema.parse(process.env);