import { z } from "zod";

/** EONET query: `status` parameter (omit = open only per API docs). */
export const eonetEventStatusSchema = z.enum(["open", "closed", "all"]);
export type EonetEventStatus = z.infer<typeof eonetEventStatusSchema>;

/**
 * Validated filters for `GET /events`.
 * Arrays are serialized as comma-separated values in the query string (EONET boolean OR semantics).
 */
export const eonetEventsQuerySchema = z.object({
  category: z.array(z.string().min(1)).optional(),
  status: eonetEventStatusSchema.optional(),
  days: z.number().int().positive().max(365).optional(),
  limit: z.number().int().positive().max(500).optional(),
  source: z.array(z.string().min(1)).optional(),
  bbox: z.tuple([z.number(), z.number(), z.number(), z.number()]).optional(),
  start: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  end: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type EonetEventsQuery = z.infer<typeof eonetEventsQuerySchema>;

const eonetCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
});

const eonetEventSourceSchema = z.object({
  id: z.string(),
  url: z.string().optional(),
  source: z.string().optional(),
  link: z.string().optional(),
});

const eonetGeometryPointSchema = z
  .object({
    type: z.literal("Point"),
    coordinates: z.tuple([z.number(), z.number()]),
  })
  .passthrough();

const eonetGeometryPolygonSchema = z
  .object({
    type: z.literal("Polygon"),
    coordinates: z.array(z.array(z.tuple([z.number(), z.number()]))),
  })
  .passthrough();

export const eonetGeometrySchema = z.discriminatedUnion("type", [
  eonetGeometryPointSchema,
  eonetGeometryPolygonSchema,
]);

export const eonetEventSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional(),
  link: z.string(),
  closed: z.string().nullable().optional(),
  categories: z.array(eonetCategorySchema),
  sources: z.array(eonetEventSourceSchema),
  geometry: z.array(eonetGeometrySchema),
  magnitudeValue: z.number().nullable().optional(),
  magnitudeUnit: z.string().nullable().optional(),
  magnitudeDescription: z.string().nullable().optional(),
});

export const eonetEventsResponseSchema = z.object({
  title: z.string(),
  description: z.string().nullable().optional(),
  link: z.string(),
  events: z.array(eonetEventSchema),
});

export type EonetEvent = z.infer<typeof eonetEventSchema>;
export type EonetEventsResponse = z.infer<typeof eonetEventsResponseSchema>;
