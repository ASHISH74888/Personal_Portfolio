import path from 'path';
import { defineConfig, loadEnv, type Plugin, type ViteDevServer } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * `vite dev` doesn't know about Vercel's `api/` directory, so the contact form
 * would only be testable once deployed. This mounts the same handler on the dev
 * server, adapting Node's req/res to the shape the function expects.
 */
const devApi = (): Plugin => ({
  name: 'dev-api-contact',
  apply: 'serve',
  configureServer(server: ViteDevServer) {
    server.middlewares.use('/api/contact', async (req, res) => {
      const chunks: Buffer[] = [];
      for await (const chunk of req) chunks.push(chunk as Buffer);

      const send = (code: number, body: unknown) => {
        res.statusCode = code;
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(body));
      };
      const shim = {
        status(code: number) {
          return { json: (body: unknown) => send(code, body) };
        },
        json: (body: unknown) => send(200, body),
        setHeader: (name: string, value: string) => res.setHeader(name, value),
      };

      try {
        const mod = await server.ssrLoadModule('/api/contact.ts');
        await mod.default(
          { method: req.method, headers: req.headers, body: Buffer.concat(chunks).toString() },
          shim,
        );
      } catch (error) {
        server.config.logger.error(`[dev-api] ${String(error)}`);
        send(500, { error: 'Dev handler threw. See the terminal.' });
      }
    });
  },
});

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');

    // The dev handler reads these off `process.env`, same as it will on Vercel.
    // Deliberately not passed through `define` — they must never reach the bundle.
    for (const key of ['SMTP_HOST', 'SMTP_PORT', 'SMTP_USER', 'SMTP_PASS', 'CONTACT_TO']) {
      if (env[key]) process.env[key] = env[key];
    }

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react(), devApi()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
