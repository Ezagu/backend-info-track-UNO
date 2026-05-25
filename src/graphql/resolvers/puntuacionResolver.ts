import { GraphQLError } from "graphql"
import type { Context } from "../../types/auth.js"
import type { PuntuarProfesorInput } from "../../types/puntuacion.js"
import { Profesor } from "../../database/models/Profesor.js"
import { Puntuacion } from "../../database/models/Puntacion.js"

export const puntuacionResolver = () =>{
  return {
    Mutation: {
      puntuarProfesor: async (_root: undefined, args: PuntuarProfesorInput, context: Context) => {
        // Validar que este logueado el usuario
        if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

        // TODO: Validar datos ingresados

        // Si no existe el profesor tirar un error
        const profesor = await Profesor.findById(args.profesorId)
        if(!profesor) throw new GraphQLError('No se encontró el profesor', {extensions: {code: "PROFESOR_NOT_FOUND"}})

        // Validar que el usuario no haya puntuado anteriormente al profesor
        const puntuacionExists = await Puntuacion.findOne({usuarioId: context.currentUser.id, profesorId: profesor.id})
        if(puntuacionExists) throw new GraphQLError('Profesor ya puntuado', {extensions: {code: 'PUNTUACION_ALREADY_EXISTS'}})

        // Creamos la puntuación
        const puntuacion = new Puntuacion({
        profesorId: profesor._id,
        usuarioId: context.currentUser.id,
        puntuacion: args.puntuacion,
        })
        // Si hay un comentario lo agregamos
        if(args.comentario) puntuacion.comentario = args.comentario
        // Guardar en la base de datos
        await puntuacion.save()
        return puntuacion
      }
    }
  }
}