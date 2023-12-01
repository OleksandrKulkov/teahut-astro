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

<<<<<<< HEAD
const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      author: z.string().optional(),
      description: z.string(),
      pubDate: z.date(),
      image: z.string().optional(),
      featured: z.boolean().optional(),
      draft: z.boolean().optional(),
      category: z.array(z.string()).optional(),
      tags: z.array(z.string())
    })
})
=======
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
>>>>>>> 14bb078aa4f0736d8bc80f1168a4cc017dcd2b2c

export const collections = { teas };
