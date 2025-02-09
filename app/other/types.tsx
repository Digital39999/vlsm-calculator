import { z } from 'zod';

export type TimeUnits = 'ns' | 'µs' | 'ms' | 's' | 'm' | 'h' | 'd' | 'w';

export type Network = z.infer<typeof ZodNetwork>;

export type Host = {
	name: string;

	hostsNeeded: number;
	hostsAvailable: number;
	unusedHosts: number;

	networkAddress: string;
	broadcastAddress: string;

	subnetSlash: number;
	subnetMask: string;
	wildcardMask: string;

	usableRange: {
		start: string;
		end: string;
	};

	networkRange: {
		start: string;
		end: string;
	};
};

export const ZodNetwork = z.object({
	baseAddress: z.string(),
	basePrefix: z.number(),

	devices: z.array(z.object({
		name: z.string(),
		hosts: z.number(),
	})),
});
