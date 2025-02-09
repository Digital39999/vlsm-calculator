import { base64ToJson, calculateSubnets, isValidNetwork, jsonToBase64 } from '~/other/utils';
import { networkColumns } from '~/components/table/Columns';
import { Host, Network, ZodNetwork } from '~/other/types';
import { useCallback, useEffect, useState } from 'react';
import { DataTable } from '~/components/table/DataTable';
import { Separator } from '~/components/ui/separator';
import { LoaderFunctionArgs } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { Input } from '~/components/ui/input';
import { Layout } from '~/components/Layout';
import { useToast } from '~/hooks/useToast';
import { FaTrash } from 'react-icons/fa';

export function loader({ request }: LoaderFunctionArgs) {
	const query = new URLSearchParams(request.url.split('?')[1]);
	const data = query.get('data');

	try {
		const network = data ? base64ToJson(data) : undefined;
		const isValid = ZodNetwork.safeParse(network);
		if (isValid.success) return { network: isValid.data as Network };
	} catch {
		// Do nothing.
	}

	return { network: null };
}

export default function Index() {
	const { network } = useLoaderData<typeof loader>();

	const [state, setState] = useState<Partial<Network> | null>(network);
	const [results, setResults] = useState<Host[]>([]);
	const { toast } = useToast();

	const showToast = useCallback((message: string, isGood: boolean) => {
		toast({
			title: message,
			variant: isGood ? 'default' : 'destructive',
			duration: 3000,
		});
	}, [toast]);

	useEffect(() => {
		if (network && isValidNetwork(network)) {
			try {
				const results = calculateSubnets(network);
				setResults(results);
			} catch (error) {
				showToast(error instanceof Error ? error.message : 'An error occurred.', false);
			}
		}
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (state) {
			const base64 = jsonToBase64(state);
			history.replaceState({}, '', `/?data=${base64}`);
		} else {
			history.replaceState({}, '', '/');
		}
	}, [state]);

	return (
		<Layout>
			<div className='flex flex-col py-24 text-center mx-auto gap-16 justify-center items-center w-full max-w-9xl'>
				<div className='flex flex-col gap-4 flex-1 w-full max-w-3xl'>
					<h3 className='text-2xl font-bold'>Network Configuration</h3>

					<div className='flex gap-2 w-full'>
						<Input
							id='baseAddress'
							placeholder='192.168.1.0'
							value={state?.baseAddress ?? ''}
							onChange={(e) => {
								setState({ ...state, baseAddress: e.target.value });
								setResults([]);
							}}
							className='flex-grow'
						/>

						<Input
							type='number'
							id='basePrefix'
							placeholder='24'
							min={0}
							max={32}
							value={state?.basePrefix ?? ''}
							onChange={(e) => {
								setState({ ...state, basePrefix: Number(e.target.value) });
								setResults([]);
							}}
							className='w-20'
						/>

						<Button
							onClick={() => {
								if (!state) return showToast('No network configuration to copy.', false);

								const base64 = jsonToBase64(state);
								navigator.clipboard.writeText(`${location.origin}/?data=${base64}`);
								showToast('Link copied to clipboard.', true);
							}}
						>
							Copy Link
						</Button>
					</div>

					<Separator />

					<div className='flex flex-col gap-2'>
						{state?.devices?.map((device, index) => (
							<div key={index} className='flex gap-2 w-full'>
								<Input
									id={`device-${index}-name`}
									placeholder='Router'
									value={device.name ?? ''}
									onChange={(e) => {
										const devices = state?.devices ?? [];
										if (!devices[index]) devices[index] = { name: '', hosts: 0 };
										devices[index].name = e.target.value;
										setState({ ...state, devices });
									}}
									className='flex-grow'
								/>

								<Input
									type='number'
									id={`device-${index}-hosts`}
									placeholder='10'
									min={0}
									value={device.hosts ?? ''}
									onChange={(e) => {
										const devices = state?.devices ?? [];
										if (!devices[index]) devices[index] = { name: '', hosts: 0 };
										devices[index].hosts = Number(e.target.value);
										setState({ ...state, devices });
									}}
									className='w-20'
								/>

								<Button
									variant='destructive'
									onClick={() => {
										const devices = state?.devices ?? [];
										devices.splice(index, 1);
										setState({ ...state, devices });
									}}
								>
									<FaTrash />
								</Button>
							</div>
						))}

						<Button
							variant='secondary'
							onClick={() => {
								const devices = state?.devices ?? [];
								devices.push({ name: '', hosts: 0 });
								setState({ ...state, devices });
							}}
						>
							Add Network
						</Button>
					</div>

					<Separator />

					<Button
						onClick={() => {
							if (isValidNetwork(state)) {
								try {
									const results = calculateSubnets(state);
									setResults(results);
								} catch (error) {
									showToast(error instanceof Error ? error.message : 'An error occurred.', false);
								}
							} else {
								showToast('Invalid network configuration.', false);
							}
						}}
					>
						Calculate
					</Button>
				</div>

				{!!results.length && <div className='flex flex-col gap-4 w-full'>
					<h3 className='text-2xl font-bold'>Results</h3>

					<div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0'>
						<DataTable
							columns={networkColumns}
							data={results ?? []}
						/>
					</div>
				</div>}
			</div>
		</Layout >
	);
}
