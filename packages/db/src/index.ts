import { schema } from "typesaurus"
import { z } from "zod"

export const UserSchema = z.object({
  id: z.string().optional(),
  notionId: z.string(),
  stripeId: z.string().optional(),
  pro: z.boolean(),
  email: z.string(),
  name: z.string(),
  numSaved: z.number()
})

export type User = z.infer<typeof UserSchema>

const db = schema(($) => ({
  customers: $.collection<User>()
}))

export default db
