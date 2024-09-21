import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react-swc'
import laravel from 'laravel-vite-plugin';
import path from 'path';



export default defineConfig(config => {

    // Load env file based on `mode` in the current working directory.
    // https://main.vitejs.dev/config/#using-environment-variables-in-config
    const env = loadEnv(config.mode, process.cwd(), '');

    return {
        define: {
            __APP_ENV__: JSON.stringify(env.APP_ENV),
        },
        css: {
            preprocessorOptions: {
                scss: {},
            },
        },
        plugins: [
            laravel({
                input: [
                    'resources/app/main.scss',
                    'resources/app/main.tsx',
                ],
                refresh: true,
            }),
            react(),
        ],
        resolve: {
            alias: {
                '@': path.resolve(__dirname, 'resources/app'),
            },
        },
        server: {
            hmr: {
                host: '127.0.0.1',
            },
            watch: {
                usePolling: true
            }
        },
    }
});
