import { z } from 'zod';

export const gameEntrySchema = z.object({
  slug: z
    .string()
    .regex(/^[a-z0-9-]+$/, 'slug must be lowercase alphanumeric with dashes'),
  title: z.string().min(1),
  author: z.string().min(1),
  embedUrl: z.string().url(),
  thumbnail: z.string().min(1),
  cabinet: z
    .object({
      position: z.tuple([z.number(), z.number(), z.number()]),
      rotationY: z.number(),
    })
    .optional(),
});

export const gamesArraySchema = z
  .array(gameEntrySchema)
  .refine(
    (games) => {
      const slugs = games.map((g) => g.slug);
      return new Set(slugs).size === slugs.length;
    },
    { message: 'All slugs must be unique' },
  );
