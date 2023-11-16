import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import swup from '@swup/astro';
import mdx from '@astrojs/mdx';

// https://astro.build/config
export default defineConfig({
	integrations: [
		tailwind(),
		swup({
			theme: 'fade',
			reloadScripts: true,
		}),
		mdx(),
	],
});
