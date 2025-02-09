import { isRouteErrorResponse, Outlet, useLoaderData, useRouteError } from '@remix-run/react';
import { LoaderFunctionArgs, LinksFunction, MetaFunction } from '@remix-run/node';
import { createThemeAction, Theme, ThemeProvider } from 'remix-themes';
import { themeSessionResolver } from '~/utils/storage.server';
import { NavigationProvider } from './components/Navigation';
import ErrorComp from '~/components/errors/ErrorPage';
import { cssBundleHref } from '@remix-run/css-bundle';
import { Toaster } from '~/components/ui/toaster';
import { Layout } from '~/components/Layout';
import { keywords } from './other/keywords';
import { StrictMode } from 'react';
import Document from '~/document';
import '~/styles/global.css';

export const links: LinksFunction = () => [
	...(cssBundleHref ? [{ rel: 'stylesheet', href: cssBundleHref }] : []),
	{ rel: 'manifest', href: '/manifest.json' },
	{ rel: 'icon', href: '/favicon.ico' },
];

export const meta: MetaFunction = () => {
	return [
		{ charset: 'utf-8' },
		{ name: 'viewport', content: 'width=device-width, initial-scale=1' },

		{ title: 'VLSM Calculator' },
		{ name: 'description', content: 'Quickly calculate subnetting with our VLSM Calculator app! Easily divide IP ranges, optimize address allocation, and visualize subnet details in seconds.' },

		{ property: 'og:title', content: 'VLSM Calculator' },
		{ property: 'og:description', content: 'Quickly calculate subnetting with our VLSM Calculator app! Easily divide IP ranges, optimize address allocation, and visualize subnet details in seconds.' },

		{ name: 'twitter:title', content: 'VLSM Calculator' },
		{ name: 'twitter:description', content: 'Quickly calculate subnetting with our VLSM Calculator app! Easily divide IP ranges, optimize address allocation, and visualize subnet details in seconds.' },

		{ name: 'keywords', content: keywords.join(', ') },
		{ name: 'theme-color', content: '#6171d6' },

		{ httpEquiv: 'Content-Security-Policy', content: 'img-src * data: blob:;' },
	];
};

export function shouldReinvalidate() {
	return false;
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
	const { getTheme } = await themeSessionResolver(request);
	return { ssrTheme: getTheme() };
};

export const action = createThemeAction(themeSessionResolver);

export default function App() {
	const { ssrTheme } = useLoaderData<typeof loader>();

	return (
		<StrictMode>
			<ThemeProvider specifiedTheme={ssrTheme} themeAction='/' disableTransitionOnThemeChange>
				<NavigationProvider>
					<Document ssrTheme={Boolean(ssrTheme)}>
						<Outlet />
						<Toaster />
					</Document>
				</NavigationProvider>
			</ThemeProvider>
		</StrictMode>
	);
}

export function ErrorBoundary() {
	const error = useRouteError();

	return (
		<StrictMode>
			<ThemeProvider specifiedTheme={Theme.DARK} themeAction='/' disableTransitionOnThemeChange>
				<Document ssrTheme={false}>
					<Layout>
						{isRouteErrorResponse(error) ? (
							<ErrorComp status={error.status as never} text={error.statusText || error.data} />
						) : error instanceof Error ? (
							<ErrorComp status={500} text={error.message} />
						) : (
							<ErrorComp status={500} />
						)}
					</Layout>
				</Document>
			</ThemeProvider>
		</StrictMode>
	);
}
