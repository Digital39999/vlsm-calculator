import { Link, useNavigate } from '@remix-run/react';
import { Button } from '~/components/ui/button';
import { useMemo } from 'react';

export type ErrorProps = {
	text?: string;
	status: keyof typeof errorMessages;
};

export default function Error({ status, text }: ErrorProps) {
	const navigate = useNavigate();

	const messages = useMemo(() => {
		return errorMessages[status] || errorMessages[500];
	}, [status]);

	return (
		<div className='mt-48 flex h-full w-full'>
			<div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
				<h1 className='text-[7rem] font-bold leading-tight'>{status || 500}</h1>
				<h3 className='text-2xl font-bold'>{messages.title}</h3>
				<p className='text-center text-muted-foreground'>
					{text || messages.description}
				</p>
				<div className='mt-2 flex gap-2'>
					<Button variant='outline' onClick={() => navigate(-1)}>Go Back</Button>
					<Link to={'/'}><Button variant='outline'>Go Home</Button></Link>
				</div>
			</div>
		</div>
	);
}

export const errorMessages = {
	404: {
		title: 'Page Not Found',
		description: 'The page you are looking for does not exist or has been moved.',
	},
	500: {
		title: 'Internal Server Error',
		description: 'An unexpected error occurred while processing your request.',
	},
	503: {
		title: 'Service Unavailable',
		description: 'The server is currently unavailable. Please try again later.',
	},
};
