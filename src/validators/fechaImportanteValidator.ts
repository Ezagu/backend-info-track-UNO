import * as z from 'zod'
import { GraphQLError } from 'graphql'

const FechaImportanteSchema = z.object({
  tipo: z.enum([
    'PARO',
    'FERIADO',
    'INSCRIPCION_MATERIAS',
    'INSCRIPCION_FINALES',
    'INICIO_CURSADA',
    'FIN_CURSADA'
  ]),
  fechaInicio: z.string(),
  fechaFin: z.string(),
  descripcion: z.string()
    .min(5)
    .max(300)
})

export const validateFechaImportanteInput = (input: unknown) => {
  const result = FechaImportanteSchema.safeParse(input)

  if (!result.success) {
    throw new GraphQLError('Error de validación')
  }

  return result.data
}