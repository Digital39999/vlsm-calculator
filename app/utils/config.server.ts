import { parseZodError } from '~/other/utils';
import { z } from 'zod';

const config = {
	sessionSecret: process.env.SESSION_SECRET!,
} satisfies z.infer<typeof ConfigSchema>;

const ConfigSchema = z.object({
	sessionSecret: z.string(),
});

const validatedConfig = ConfigSchema.safeParse(config);
if (!validatedConfig.success) throw new Error(JSON.stringify(parseZodError(validatedConfig.error), null, 5));

export default validatedConfig.data;
