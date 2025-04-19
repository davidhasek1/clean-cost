import { z } from 'zod';

export const binResponseSchema = z.object({
  defaults: z.object({
    base_price: z.number(),
    beds_price: z.number(),
    baths_price: z.number(),
    kitchen_price: z.number(),
    living_room_price: z.number(),
    price_for_km: z.number(),
    cleaning_props_percentage: z.number(),
  }),
  /*   clients: z.object({
    name: z.string(),
    final_price: z.number(),
  }), */
});
