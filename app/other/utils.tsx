import { Host, Network, TimeUnits } from '~/other/types';
import { ZodError, ZodIssue } from 'zod';

export function parseZodError(error: ZodError) {
	const errors: string[] = [];

	const formatSchemaPath = (path: (string | number)[]) => {
		return !path.length ? 'Schema' : `Schema.${path.join('.')}`;
	};

	const firstLetterToLowerCase = (str: string) => {
		return str.charAt(0).toLowerCase() + str.slice(1);
	};

	const makeSureItsString = (value: unknown) => {
		return typeof value === 'string' ? value : JSON.stringify(value);
	};

	const parseZodIssue = (issue: ZodIssue) => {
		switch (issue.code) {
			case 'invalid_type': return `${formatSchemaPath(issue.path)} must be a ${issue.expected} (invalid_type)`;
			case 'invalid_literal': return `${formatSchemaPath(issue.path)} must be a ${makeSureItsString(issue.expected)} (invalid_literal)`;
			case 'custom': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (custom)`;
			case 'invalid_union': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_union)`;
			case 'invalid_union_discriminator': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_union_discriminator)`;
			case 'invalid_enum_value': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_enum_value)`;
			case 'unrecognized_keys': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (unrecognized_keys)`;
			case 'invalid_arguments': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_arguments)`;
			case 'invalid_return_type': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_return_type)`;
			case 'invalid_date': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_date)`;
			case 'invalid_string': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_string)`;
			case 'too_small': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (too_small)`;
			case 'too_big': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (too_big)`;
			case 'invalid_intersection_types': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (invalid_intersection_types)`;
			case 'not_multiple_of': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (not_multiple_of)`;
			case 'not_finite': return `${formatSchemaPath(issue.path)} ${firstLetterToLowerCase(issue.message)} (not_finite)`;
			default: return `Schema has an unknown error (JSON: ${JSON.stringify(issue)})`;
		}
	};

	for (const issue of error.issues) {
		const parsedIssue = parseZodIssue(issue) + '.';
		if (parsedIssue) errors.push(parsedIssue);
	}

	return errors;
}

export function time(number: number, from: TimeUnits = 's', to: TimeUnits = 'ms'): number {
	const units: Record<TimeUnits, number> = {
		'ns': 1,
		'µs': 1000,
		'ms': 1000000,
		's': 1000000000,
		'm': 60000000000,
		'h': 3600000000000,
		'd': 86400000000000,
		'w': 604800000000000,
	};

	if (from === to) return number;
	else return (number * units[from]) / units[to];
}

export function calculateSubnets(network: Network): Host[] {
	const sortedDevices = network.devices.sort((a, b) => b.hosts - a.hosts);

	if (!isIP(network.baseAddress) || network.basePrefix < 0 || network.basePrefix > 32) throw new Error('Invalid network configuration.');
	let currentBaseAddress = ipToInt(network.baseAddress);
	const results: Host[] = [];

	console.log(currentBaseAddress);

	if (sortedDevices.length === 0) throw new Error('No devices provided.');
	else if (sortedDevices.some((device) => device.hosts < 2)) throw new Error('All subnets must have at least 2 hosts.');
	else if (sortedDevices.some((device) => device.hosts > 65534)) throw new Error('All subnets must have at most 65534 hosts.');
	else if (sortedDevices.length > 65534) throw new Error('Too many subnets provided.');
	else if (currentBaseAddress < 0 || currentBaseAddress > 4294967295) throw new Error('Invalid base address.');
	else if (network.basePrefix < 0 || network.basePrefix > 32) throw new Error('Invalid base prefix.');
	else if (sortedDevices.reduce((acc, device) => acc + device.hosts, 0) > Math.pow(2, 32 - network.basePrefix)) throw new Error('Not enough hosts available.');
	else if (sortedDevices.some((device) => device.hosts > Math.pow(2, 32 - network.basePrefix) - 2)) throw new Error('Not enough hosts available for a subnet.');

	for (const device of sortedDevices) {
		const subnetSlash = calculateSubnetPrefix(device.hosts);
		const subnetMask = prefixToSubnetMask(subnetSlash);
		const wildcardMask = calculateWildcardMask(subnetMask);
		const hostsAvailable = Math.pow(2, 32 - subnetSlash) - 2;
		const broadcastAddress = currentBaseAddress + hostsAvailable + 1;

		results.push({
			name: device.name,
			bits: 32 - subnetSlash,

			hostsNeeded: device.hosts,
			hostsAvailable,
			unusedHosts: hostsAvailable - device.hosts,

			networkAddress: intToIp(currentBaseAddress),
			broadcastAddress: intToIp(broadcastAddress),

			subnetSlash,
			subnetMask,
			wildcardMask,

			usableRange: {
				start: intToIp(currentBaseAddress + 1),
				end: intToIp(broadcastAddress - 1),
			},

			networkRange: {
				start: intToIp(currentBaseAddress),
				end: intToIp(broadcastAddress),
			},
		});

		currentBaseAddress = broadcastAddress + 1;
	}

	return results;
}

export function ipToInt(ip: string): number {
	return ip.split('.').reduce((acc, octet) => (acc * 256) + parseInt(octet, 10), 0);
}

export function intToIp(int: number): string {
	return [
		(int >>> 24) & 0xFF,
		(int >>> 16) & 0xFF,
		(int >>> 8) & 0xFF,
		int & 0xFF,
	].join('.');
}

export function calculateSubnetPrefix(hosts: number): number {
	let power = 0;
	while (Math.pow(2, power) - 2 < hosts) power++;
	return 32 - power;
}

export function prefixToSubnetMask(prefix: number): string {
	return Array(4).fill(0).map((_, i) => ((0xffffffff << (32 - prefix)) >>> (i * 8)) & 255).reverse().join('.');
}

export function calculateWildcardMask(subnetMask: string): string {
	return subnetMask.split('.').map((octet) => (255 - parseInt(octet, 10)).toString()).join('.');
}

export function isValidNetwork(network: Partial<Network> | null): network is Network {
	if (!network) return false;
	else if (!network.baseAddress || !isIP(network.baseAddress)) return false;
	else if (network.basePrefix === undefined || network.basePrefix < 0 || network.basePrefix > 32) return false;
	else if (!network.devices || !Array.isArray(network.devices)) return false;
	else if (network.devices.some((device) => !device.name || typeof device.name !== 'string')) return false;
	else if (network.devices.some((device) => device.hosts === undefined || device.hosts < 0 || device.hosts > 65534)) return false;

	return true;
}

export function isIP(str: string) {
	const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}$/;
	if (ipv4Regex.test(str)) return 4;
	return 0;
}

export function jsonToBase64(json: Record<string, unknown>): string {
	return btoa(JSON.stringify(json));
}

export function base64ToJson(base64: string): Record<string, unknown> {
	return JSON.parse(atob(base64));
}
