import { Meta, Links, ScrollRestoration, Scripts } from '@remix-run/react';
import { PreventFlashOnWrongTheme, useTheme } from 'remix-themes';
import { cn } from './lib/utils';

export type DocumentProps = {
	children: React.ReactNode;
	ssrTheme: boolean;
};

export default function Document({ children, ssrTheme }: DocumentProps) {
	const [theme] = useTheme();

	return (
		<html id='root' lang='en' suppressHydrationWarning={true} className={cn(theme)}>
			<head>
				<Meta />
				<meta charSet='utf-8' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<PreventFlashOnWrongTheme ssrTheme={ssrTheme} />
				<Links />
			</head>
			<body>
				{children}
				<Scripts />
				<ScrollRestoration />
			</body>
		</html>
	);
}
