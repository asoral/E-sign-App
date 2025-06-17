import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	server: {
		port: 8080,
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../esign_app/public/esignDash',
		emptyOutDir: true,
		target: 'es2015',
	},
	css: {
		postcss: {
		  plugins: [
			tailwindcss,
			autoprefixer
		  ],
		},
	  },
});
