import * as z from 'zod'
import { formatearErrorValidacion } from '../helpers/formatearErrorValidacion.js'

const PuntuarProfesor = z.object({
  profesorId: z.string(),
  puntuacion: z.number()
    .min(0, "La puntuacion debe ser mínimo 0")
    .max(5, "La puntuacion debe ser máximo 5"),
  comentario: z.string()
    .trim()
    .min(3, "El comentario debe contener mínimo 3 caracteres")
    .max(255, "El comentario no puede contener mas de 255 caracteres")
    .optional()
})

const ModificarPuntuacion = z.object({
  puntuacionId: z.string(),
  puntuacion: z.number()
    .min(0, "La puntuacion debe ser mínimo 0")
    .max(5, "La puntuacion debe ser máximo 5")
    .optional(),
  comentario: z.string()
    .trim()
    .min(3, "El comentario debe contener mínimo 3 caracteres")
    .max(255, "El comentario no puede contener mas de 255 caracteres")
    .optional()
})

// Validators
export const ValidatePuntuarProfesor = (input: unknown) => {
  return formatearErrorValidacion(z.safeParse(PuntuarProfesor, input))
}

export const ValidateModificarPuntuacion = (input: unknown) => {
  return formatearErrorValidacion(z.safeParse(ModificarPuntuacion, input))
}