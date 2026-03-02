import { z } from 'zod';

export const createShiftSchema = z.object({
  locationId: z.string().uuid(),
  startTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid startTime" }),
  endTime: z.string().refine(val => !isNaN(Date.parse(val)), { message: "Invalid endTime" }),
  requiredSkillId: z.string(),
  headcount: z.number().min(1),
});

export const updateShiftSchema = createShiftSchema.partial();