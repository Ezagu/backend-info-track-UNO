import { GraphQLError } from "graphql"
import type { Context } from "../../types/auth.js"
import type { ModificarPuntuacionInput, PuntuarProfesorInput } from "../../types/puntuacion.js"
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
      },
      modificarPuntuacionProfesor: async(_root: undefined, args: ModificarPuntuacionInput, context: Context) => {
        // Validar que este logueado el usuario
        if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

        // Validar que envie datos a actualizar
        if(!args.comentario && !args.puntuacion) throw new GraphQLError('Falta enviar los datos a modificar', {extensions: {code: "MISSING_ARGUMENT"}})

        // Validar que exista la puntuacion
        const puntuacion = await Puntuacion.findById(args.puntuacionId)
        if(!puntuacion) throw new GraphQLError('No existe la puntuacion', {extensions: {code: "PUNTUACION_NOT_FOUND"}})
        
        // Validar que la puntuacion sea del usuario identificado
        if(puntuacion.usuarioId?.toString() !== context.currentUser.id.toString()) throw new GraphQLError('Puntuacion no pertenece a usuario identificado', {extensions: {code: "FORBIDDEN"}})

        // Actualizar la puntuacion
        puntuacion.comentario = args.comentario || puntuacion.comentario || null
        puntuacion.puntuacion = args.puntuacion || puntuacion.puntuacion

        return await puntuacion.save()
      }
    }
  }
}