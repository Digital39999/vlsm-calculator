import type { ServerBuild } from '@remix-run/server-runtime';
import { serveStatic } from '@hono/node-server/serve-static';
import { HttpBindings, serve } from '@hono/node-server';
import LoggerModule from '~/utils/logger.server';
import { createMiddleware } from 'hono/factory';
import { remix } from 'remix-hono/handler';
import { compress } from 'hono/compress';
import { time } from '~/other/utils';
import { logger } from 'hono/logger';
import { config } from 'dotenv';
import { Hono } from 'hono';

config({ path: '../.env' });

const isProd = process.env.NODE_ENV === 'production';
const app = new Hono<{ Bindings: HttpBindings; }>();

if (isProd) app.use(compress());

app.use('*', cacheMiddleware(time(30, 'd', 's')), serveStatic({ root: isProd ? './build/client' : './public' }));
app.use('*', logger((m, ...rest) => LoggerModule('Server', m, 'blue', ...rest)));

/* -------------------- Remix -------------------- */

const viteDevServer = isProd
	? undefined
	: await import('vite').then((vite) =>
		vite.createServer({
			server: { middlewareMode: true },
			appType: 'custom',
		}),
	);

app.use(async (c, next) => {
	const build = viteDevServer
		? await viteDevServer.ssrLoadModule('virtual:remix/server-build') as unknown as ServerBuild
		// @ts-ignore
		// eslint-disable-next-line
		: await import('../build/server/remix.js') as unknown as ServerBuild;

	return remix({
		build,
		mode: isProd ? 'production' : 'development',
	})(c, next);
});

if (isProd) {
	serve({ ...app, port: 3000 }, async (info) => {
		console.clear();
		LoggerModule('Hono', `🚀 Server started on port ${info.port}!\n`, 'green');
	});
}

export default app;

export function cacheMiddleware(seconds: number) {
	return createMiddleware(async (c, next) => {
		if (
			!c.req.path.match(/\.[a-zA-Z0-9]+$/) ||
			c.req.path.endsWith('.data')
		) return next();

		await next();

		if (!c.res.ok) return;
		c.res.headers.set('cache-control', `public, max-age=${seconds}`);
	});
}
