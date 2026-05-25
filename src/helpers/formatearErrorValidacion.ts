import { GraphQLError } from "graphql"
import type { ZodSafeParseResult } from "zod"

export const formatearErrorValidacion = <T>(result: ZodSafeParseResult<T>): T => {
  if(!result.success) {
    // Formatear los errores
    const errors = result.error.issues.map(issue => ({
      field: issue.path[0],
      message: issue.message
    }))

    // Tirar error de graphql
    throw new GraphQLError('Error de validación', {
      extensions: {
        code: 'VALIDATION_ERROR',
        errors
      }
    })
  }
  return result.data
}