import { z } from "zod";

export const firmsSourceSchema = z.enum(["VIIRS_NOAA20_NRT"]);
export type FirmsSource = z.infer<typeof firmsSourceSchema>;

export const firmsAreaSchema = z.union([
  z.literal("world"),
  z.tuple([
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
    z.number().min(-180).max(180),
    z.number().min(-90).max(90),
  ]),
]);
export type FirmsArea = z.infer<typeof firmsAreaSchema>;

export const firmsDayRangeSchema = z.number().int().min(1).max(5);

export const firmsAreaCsvQuerySchema = z.object({
  source: firmsSourceSchema.optional(),
  area: firmsAreaSchema.optional(),
  dayRange: firmsDayRangeSchema.optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
});
export type FirmsAreaCsvQuery = z.infer<typeof firmsAreaCsvQuerySchema>;

function numberFromCsv(schema: z.ZodNumber) {
  return z.preprocess((value) => {
    if (typeof value === "string") return Number(value.trim());
    return value;
  }, schema);
}

const acqTimeSchema = z.preprocess(
  (value) => {
    if (typeof value === "number") return String(value);
    if (typeof value === "string") return value.trim();
    return value;
  },
  z.string().regex(/^\d{1,4}$/).transform((value) => value.padStart(4, "0")),
);

export const firmsConfidenceSchema = z
  .enum(["l", "n", "h", "low", "nominal", "high"])
  .transform((value) => {
    if (value === "low") return "l";
    if (value === "nominal") return "n";
    if (value === "high") return "h";
    return value;
  });
export type FirmsConfidence = z.infer<typeof firmsConfidenceSchema>;

export const firmsDayNightSchema = z.enum(["D", "N"]);
export type FirmsDayNight = z.infer<typeof firmsDayNightSchema>;

export const firmsDetectionSchema = z.object({
  latitude: numberFromCsv(z.number().min(-90).max(90)),
  longitude: numberFromCsv(z.number().min(-180).max(180)),
  bright_ti4: numberFromCsv(z.number()),
  scan: numberFromCsv(z.number().positive()),
  track: numberFromCsv(z.number().positive()),
  acq_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  acq_time: acqTimeSchema,
  satellite: z.string().min(1),
  instrument: z.string().min(1),
  confidence: firmsConfidenceSchema,
  version: z.string().min(1),
  bright_ti5: numberFromCsv(z.number()),
  frp: numberFromCsv(z.number().nonnegative()),
  daynight: firmsDayNightSchema,
});
export type FirmsDetection = z.infer<typeof firmsDetectionSchema>;

export const firmsDetectionsSchema = z.array(firmsDetectionSchema);
