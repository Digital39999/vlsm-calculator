import { LoaderFunctionArgs } from '@remix-run/node';
import Error from '~/components/errors/ErrorPage';
import { useLoaderData } from '@remix-run/react';
import { Layout } from '~/components/Layout';

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const query = new URLSearchParams(request.url.split('?')[1]);
	const code = query.get('code');

	if (code) return { status: 500 } as const;
	else return new Response(null, { status: 404 });
};

export default function ErrorPage() {
	const { status } = useLoaderData<typeof loader>();

	return (
		<Layout>
			<Error status={status} />
		</Layout>
	);
}
