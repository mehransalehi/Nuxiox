import {z} from "zod"

export function checkZod<T>(schema: z.ZodSchema<T>) {
  return async (data: unknown) => {
    const result = schema.safeParse(data);
    if (!result.success) {
      throw createError({
        statusCode: 422,
        statusMessage: "Validation failed",
        data: z.treeifyError(result.error),
      });
    }

    return result.data;
  };
}
