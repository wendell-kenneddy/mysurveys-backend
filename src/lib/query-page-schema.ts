import { z } from "zod";

export const queryPageSchema = z.object({
  offset: z
    .number()
    .min(0, "Offset can't be lower than 0.")
    .int("Offset must be an integer."),
  size: z
    .number()
    .min(1, "Page size can't be lower than 1.")
    .int("Page size must be an integer.")
    .max(10, "Page size can't be greater than 10.")
});
