import {defineConfig} from 'vite';
import vue from '@vitejs/plugin-vue';
import path from 'path'

export default defineConfig(({mode}) => {
    return {
        plugins: [vue()],
        envDir: '../',
        server: {
            port: 3000,
        },
        resolve: {
            alias: {
                '@': path.resolve(__dirname, './src'),
                // '@components': path.resolve(__dirname, './src/components'),
                // '@assets': path.resolve(__dirname, './src/assets'),

            }
        }
    };
});