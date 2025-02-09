import { createCookieSessionStorage } from '@remix-run/node';
import { createThemeSessionResolver } from 'remix-themes';
import config from '~/utils/config.server';

if (!config.sessionSecret) throw new Error('Session secret is not set!');

export const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: '__session',
		httpOnly: true,
		path: '/',
		sameSite: 'none',
		secure: true,
		secrets: [config.sessionSecret],
		maxAge: 604800, // 1 week
	},
});

export const { getSession, commitSession, destroySession } = sessionStorage;
export const themeSessionResolver = createThemeSessionResolver(sessionStorage);
