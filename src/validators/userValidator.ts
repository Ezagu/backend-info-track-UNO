import * as z from 'zod'
import { formatearErrorValidacion } from '../helpers/formatearErrorValidacion.js'

// Esquemas
const UserRegister = z.object({
  nombre: z.string().trim()
    .min(3, 'Debe contener más de 3 caracteres')
    .max(40, 'Debe contener menos de 40 caracteres'),
  apellido: z.string().trim()
    .min(3, 'Debe contener más de 3 caracteres')
    .max(40, 'Debe contener menos de 40 caracteres'),
  email: z.email('Email inválido'),
  password: z.string()
    .min(8, 'Debe contener mínimo 8 caracteres')
    .max(100, 'Debe contener menos de 100 caracteres')
    .regex(/[A-Z]/, 'Debe tener al menos una mayúscula')
    .regex(/[0-9]/, 'Debe tener al menos un número'),
  carreraId: z.string().optional(),
  anioIngreso: z.int()
    .min(2015, 'Ingrese un año válido')
    .max(new Date().getFullYear(), 'Ingrese un año válido')
    .optional()
})

const UserLogin = z.object({
  email: z.email('Email inválido'),
  password: z.string().min(1, 'Contraseña requerida')
})

const EstadoMateria = z.object({
  materiaId: z.string(),
  estado: 
    z.enum(['APROBADA','REGULARIZADA','CURSANDO','PROMOCIONADA']),
  nota: z.int()
    .min(0, 'La nota mínima es 0')
    .max(10, 'La nota máxima es 10')
    .optional(),
  anio: z.int()
    .min(2015, 'Año inválido')
    .max(new Date().getFullYear(), 'Año inválido')
    .optional(),
  cuatrimestre: z.int()
    .min(1, 'Cuatrimestre inválido')
    .max(2, 'Cuatrimestre inválido')
    .optional()
})

const ActualizarUsuario = z.object({
  nombre: z.string().trim()
    .min(3, 'Debe contener más de 3 caracteres')
    .max(40, 'Debe contener menos de 40 caracteres')
    .optional(),
  apellido: z.string().trim()
    .min(3, 'Debe contener más de 3 caracteres')
    .max(40, 'Debe contener menos de 40 caracteres')
    .optional(),
  anioIngreso: z.int()
    .min(2015, 'Ingrese un año válido')
    .max(new Date().getFullYear(), 'Ingrese un año válido')
    .optional()
})

// Validators
export const validateRegisterInput = (input: unknown) => {
  return formatearErrorValidacion(z.safeParse(UserRegister, input))
}

export const validateLoginInput = (input: unknown) => {
  return formatearErrorValidacion(z.safeParse(UserLogin, input))
}

export const validateEstadoMateriaInput = (input: unknown) => {
  return formatearErrorValidacion(EstadoMateria.safeParse(input))
}

export const validateActualizarUsuario = (input: unknown) => {
  return formatearErrorValidacion(ActualizarUsuario.safeParse(input))
}