import { defineCollection, z, type CollectionEntry } from 'astro:content';
import { glob } from 'astro/loaders';

export type Project = CollectionEntry<'projects'>['data'];

const CreditSchema = z.object({
  label: z.string(),
  href: z.string().url(),
});

const ProjectSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  image: z.string(),
  featured: z.boolean(),
  visibility: z.enum(['visible', 'hidden']),
  tags: z.array(z.string()),

  date: z.date(),

  live: z.string().url().optional(),
  github: z.string().url().optional(),
  sandbox: z.string().url().optional(),

  credits: z.array(CreditSchema).optional(),
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/(projects|games)/**/*.md',
  }),
  schema: ProjectSchema,
});

export const collections = { projects };
