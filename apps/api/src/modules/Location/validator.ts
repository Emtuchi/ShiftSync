import { z } from 'zod';

export const createLocationSchema = z.object({
  name: z.string().min(2),
  address: z.string().min(3),
});

export const updateLocationSchema = z.object({
  name: z.string().min(2).optional(),
  address: z.string().min(3).optional(),
});

export type CreateLocationDTO = z.infer<typeof createLocationSchema>;
export type UpdateLocationDTO = z.infer<typeof updateLocationSchema>;