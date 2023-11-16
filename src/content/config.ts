import { z, defineCollection } from 'astro:content';

const teas = defineCollection({
	type: 'content',
	schema: ({ image }) =>
		z.object({
			title: z.string(),
			subtitle: z.string().optional(),
			description: z.string(),
			pubDate: z.date(),
			price: z.number(),
			image: image(),
			category: z.array(z.string()).optional(),
			tags: z.array(z.string()),
			slides: z.array(image()),
		}),
});

// const library = defineCollection({
// 	type: 'content',
// 	schema: z.object({
// 		title: z.string(),
// 		author: z.string().optional(),
// 		description: z.string(),
// 		pubDate: z.date(),
// 		image: z.string().optional(),
// 		featured: z.boolean().optional(),
// 		draft: z.boolean().optional(),
// 		category: z.array(z.string()).optional(),
// 		tags: z.array(z.string()),
// 	}),
// });

export const collections = { teas };
