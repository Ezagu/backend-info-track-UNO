import type { IProfesor, IPuntuacion, PuntuarProfesorInput } from "../../types/profesor.js"
import type { Context } from "../../types/auth.js"
import type { SearchInput } from "../../types/global.js"
import type { Types } from "mongoose"
import { Profesor } from "../../database/models/Profesor.js"
import { normalizarString } from "../../helpers/normalizarString.js"
import { Materia } from "../../database/models/Materia.js"
import { GraphQLError } from "graphql"
import { User } from "../../database/models/User.js"

export const profesorResolver = () =>{
    return {
        Query: {
            profesor: async (_root: undefined, args: {id: Types.ObjectId}) => {
                return await Profesor.findById(args.id)
            },
            profesores: async (_root: undefined, args: SearchInput) => {
                const {search = "", limit = 10, page = 1} = args
                // Sacamos las tildes del search
                const searchNormalizado = normalizarString(search)
                // Filtramos con el search y hacemos paginación
                return await Profesor.find(
                    {nombreNormalizado: {$regex: searchNormalizado, $options: 'i'}}
                )
                .skip((page - 1) * limit)
                .limit(limit)
            }
        },
        Mutation: {
            puntuarProfesor: async (_root: undefined, args: PuntuarProfesorInput, context: Context) => {
                // Validar que este logueado el usuario
                if(!context.currentUser) throw new GraphQLError('No identificado', {extensions: {code: "UNAUTHORIZED"}})

                // TODO: Validar datos ingresados

                // Si no existe el profesor tirar un error
                const profesor = await Profesor.findById(args.profesorId)
                if(!profesor) throw new GraphQLError('No se encontró el profesor', {extensions: {code: "PROFESOR_NOT_FOUND"}})
                // Validar que el usuario no haya puntuado anteriormente al profesor
                if(profesor.puntuaciones.find(p => p.usuarioId?.toString() === context.currentUser?.id.toString()))
                    throw new GraphQLError('Profesor ya puntuado', {extensions: {code: 'PUNTUACION_ALREADY_EXISTS'}})

                // Creamos la puntuación
                const puntuacion: IPuntuacion = {
                usuarioId: context.currentUser.id,
                puntuacion: args.puntuacion,
                }
                // Si hay un comentario lo agregamos
                if(args.comentario) puntuacion.comentario = args.comentario
                // Guardar en la base de datos
                profesor.puntuaciones.push(puntuacion)
                await profesor.save()
                return profesor
            }
        },
        Profesor: {
            materias: async (root: IProfesor) => {
                return await Materia.find({_id: root.materias})
            },
            cantidadPuntuaciones: async (root: IProfesor) => {
                return root.puntuaciones?.length
            }
        },
        Puntuacion: {
            usuario: async (root: IPuntuacion) => {
                return await User.findById(root.usuarioId)
            }
        }
    }
}