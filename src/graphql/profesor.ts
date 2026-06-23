import type { IPuntuacion } from "../types/puntuacion.js"
import type { IProfesor } from "../types/profesor.js"
import type { SearchInput } from "../types/global.js"
import type { Types } from "mongoose"
import { Profesor } from "../database/models/Profesor.js"
import { Materia } from "../database/models/Materia.js"
import { Puntuacion } from "../database/models/Puntacion.js"
import { User } from "../database/models/User.js"
import { normalizarString } from "../helpers/normalizarString.js"

export const typeDefs = `
  type PuntuacionProfesor {
    id: ID!
    usuario: Usuario!
    puntuacion: Float!
    comentario: String
    fecha: String
  }

  type Profesor {
    id: ID!
    nombre: String!
    apellido: String!
    siglas: String!
    email: String!
    puntuaciones: [PuntuacionProfesor]
    materias: [Materia]!
    cantidadPuntuaciones: Int!
    promedioPuntuaciones: Float
  }
      
  type Query {
    profesor(id: ID!): Profesor
    profesores(search: String, limit: Int, page: Int): [Profesor]
  }
`

export const resolvers = {
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
  Profesor: {
    materias: async (root: IProfesor) => {
      return await Materia.find({_id: root.materias})
    },
    puntuaciones: async (root: IProfesor) => {
      const puntuaciones = await Puntuacion.find({profesorId: root.id}).populate("usuarioId")
      return puntuaciones.map(p => ({
        ...p.toObject(),
        id: p._id.toString(),
        usuario: p.usuarioId
      }))
    },
    cantidadPuntuaciones: async (root: IProfesor) => {
      return await Puntuacion.countDocuments({profesorId: root.id})
    },
    promedioPuntuaciones: async (root: IProfesor) => {
      const puntuaciones =  await Puntuacion.find({profesorId: root.id})
      let sum = 0
      const cant = puntuaciones.length
      if(cant && cant > 0) {
        puntuaciones.forEach(p => sum += p.puntuacion)
        return sum / cant
      }
      return null
    },
    siglas: (root: IProfesor) => {
      return root.apellido.slice(0,1) + root.nombre.slice(0,1)
    }
  },
  PuntuacionProfesor: {
    usuario: async(root: IPuntuacion) => {
      return await User.findById(root.usuarioId)
    }
  }
}