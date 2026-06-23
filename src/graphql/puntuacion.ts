import type { ModificarPuntuacionInput, PuntuarProfesorInput } from "../types/puntuacion.js"
import type { Context } from "../types/auth.js"
import { GraphQLError } from "graphql"
import { Profesor } from "../database/models/Profesor.js"
import { Puntuacion } from "../database/models/Puntacion.js"
import { ValidateModificarPuntuacion, ValidatePuntuarProfesor } from "../validators/puntuacionValidator.js"

export const typeDefs = `
  type Puntuacion {
    id: String!
    usuario: Usuario!
    profesor: Profesor!
    puntuacion: Int!
    comentario: String
    fecha: String!
  }

  type Query {
    misPuntuaciones: [Puntuacion]
  }

  type Mutation {
    puntuarProfesor(profesorId: ID!, puntuacion: Int!, comentario: String): Puntuacion
    modificarPuntuacionProfesor(puntuacionId: ID!, puntuacion: Int, comentario: String): Puntuacion
    eliminarPuntuacion(puntuacionId: ID!): Puntuacion
  }
`

export const resolvers = {
  Query: {
    misPuntuaciones: async (_root: undefined, _args: undefined, context: Context) => {
      // Validar que este logueado el usuario
      if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

      const puntuaciones = await Puntuacion.find({ usuarioId: context.currentUser.id })
        .populate("profesorId")

      return puntuaciones.map(p => ({
        ...p.toObject(),
        id: p._id.toString(),
        profesor: p.profesorId,
        usuario: context.currentUser
      }))
    }
  },
  Mutation: {
    puntuarProfesor: async (_root: undefined, args: PuntuarProfesorInput, context: Context) => {
      // Validar que este logueado el usuario
      if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

      // Validar datos ingresados
      const data = ValidatePuntuarProfesor(args)

      // Si no existe el profesor tirar un error
      const profesor = await Profesor.findById(data.profesorId)
      if(!profesor) throw new GraphQLError('No se encontró el profesor', {extensions: {code: "PROFESOR_NOT_FOUND"}})

      // Validar que el usuario no haya puntuado anteriormente al profesor
      const puntuacionExists = await Puntuacion.findOne({usuarioId: context.currentUser.id, profesorId: profesor.id})
      if(puntuacionExists) throw new GraphQLError('Profesor ya puntuado', {extensions: {code: 'PUNTUACION_ALREADY_EXISTS'}})

      // Creamos la puntuación
      const puntuacion = new Puntuacion({
      profesorId: profesor._id,
      usuarioId: context.currentUser.id,
      puntuacion: data.puntuacion,
      })
      // Si hay un comentario lo agregamos
      if(data.comentario) puntuacion.comentario = data.comentario
      // Guardar en la base de datos
      await puntuacion.save()
      return {
        ...puntuacion.toObject(),
        id: puntuacion._id.toString(),
        profesor,
        usuario: context.currentUser
      }
    },
    modificarPuntuacionProfesor: async(_root: undefined, args: ModificarPuntuacionInput, context: Context) => {
      // Validar que este logueado el usuario
      if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

      // Validar datos ingresados
      const data = ValidateModificarPuntuacion(args)

      // Validar que envie datos a actualizar
      if(!data.comentario && !data.puntuacion) throw new GraphQLError('Falta enviar los datos a modificar', {extensions: {code: "MISSING_ARGUMENT"}})

      // Validar que exista la puntuacion
      const puntuacion = await Puntuacion.findById(data.puntuacionId)
      if(!puntuacion) throw new GraphQLError('No existe la puntuacion', {extensions: {code: "PUNTUACION_NOT_FOUND"}})

      const profesor = await Profesor.findById(puntuacion.profesorId)
      if(!profesor) throw new GraphQLError('No se encontró el profesor', {extensions: {code: "PROFESOR_NOT_FOUND"}})
      
      // Validar que la puntuacion sea del usuario identificado
      if(puntuacion.usuarioId?.toString() !== context.currentUser.id.toString()) throw new GraphQLError('Puntuacion no pertenece a usuario identificado', {extensions: {code: "FORBIDDEN"}})

      // Actualizar la puntuacion
      puntuacion.comentario = data.comentario || puntuacion.comentario || null
      puntuacion.puntuacion = data.puntuacion || puntuacion.puntuacion

      await puntuacion.save()
      
      return {
        ...puntuacion.toObject(),
        id: puntuacion._id.toString(),
        profesor,
        usuario: context.currentUser
      }
    },
    eliminarPuntuacion: async (_root: undefined, args: {puntuacionId: string}, context: Context) => {
      // Validar que este logueado el usuario
      if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

      // Validar que exista la puntuacion
      const puntuacion = await Puntuacion.findById(args.puntuacionId)
      if(!puntuacion) throw new GraphQLError('No existe la puntuacion', {extensions: {code: "PUNTUACION_NOT_FOUND"}})
      
      // Validar que la puntuacion sea del usuario identificado
      if(puntuacion.usuarioId?.toString() !== context.currentUser.id.toString()) throw new GraphQLError('Puntuacion no pertenece a usuario identificado', {extensions: {code: "FORBIDDEN"}})

      await puntuacion.deleteOne()
      return puntuacion
    }
  }
}