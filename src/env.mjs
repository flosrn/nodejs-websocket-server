import { z } from "zod"

z.object({
	PORT: z.coerce.number(),
}).parse(process.env)
