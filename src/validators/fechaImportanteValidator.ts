import * as z from 'zod'
import { formatearErrorValidacion } from '../helpers/formatearErrorValidacion.js'

const FechaImportanteSchema = z.object({
  tipo: z.enum([
    'PARO',
    'FERIADO',
    'INSCRIPCION_MATERIAS',
    'INSCRIPCION_FINALES',
    'INICIO_CURSADA',
    'FIN_CURSADA'
  ]),
  fechaInicio: z.date(),
  fechaFin: z.date().optional(),
  descripcion: z.string()
    .min(5)
    .max(300)
})

export const validateFechaImportanteInput = (input: unknown) => {
  return formatearErrorValidacion(z.safeParse(FechaImportanteSchema, input))
}