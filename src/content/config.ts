import { z, defineCollection } from "astro:content";

const teasCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
      subtitle: z.string().optional(),
      description: z.string(),
      pubDate: z.date(),
      price: z.number(),
      image: z.string(),
      category: z.array(z.string()).optional(),
      tags: z.array(z.string())
    })
});

const postsCollection = defineCollection({
    type: 'content',
    schema: z.object({
      title: z.string(),
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

export const collections = {
  teas: teasCollection,
  library: postsCollection,
};