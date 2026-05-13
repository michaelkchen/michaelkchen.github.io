import { glob } from "astro/loaders"
import { defineCollection } from "astro:content";
import { z } from "astro/zod"

const works = defineCollection({
    loader: glob({ base: 'src/content/works', pattern:'*.md' }),
    schema: z.object({
        thumbnail: z.string(),
        title: z.string(),
        type: z.string(),
        summary: z.string()
    })
})

export const collections = { works }