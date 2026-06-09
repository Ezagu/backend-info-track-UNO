import { FechaImportante } from "../database/models/FechaImportante.js"
import { validateFechaImportanteInput } from "../validators/fechaImportanteValidator.js"

export const typeDefs = `
  enum TipoFecha {
    PARO
    FERIADO
    INSCRIPCION_MATERIAS
    INSCRIPCION_FINALES
    INICIO_CURSADA
    FIN_CURSADA
  }

  type FechaImportante {
    id: ID!
    tipo: TipoFecha!
    fechaInicio: String!
    fechaFin: String!
    descripcion: String!
  }

  type Query {
    fechasImportantes: [FechaImportante]
  }

  type Mutation {
    crearFechaImportante(
      tipo: TipoFecha!
      fechaInicio: String!
      fechaFin: String!
      descripcion: String!
    ): FechaImportante
  }
`

export const resolvers = {
  Query: {
    fechasImportantes: async () => {
      const hoy = new Date()

      return await FechaImportante.find({
        fechaFin: { $gte: hoy }
      }).sort({
        fechaInicio: 1
      })
    }
  },

  Mutation: {
    crearFechaImportante: async (_root: undefined, args: unknown) => {

      const data = validateFechaImportanteInput(args)

      const fecha = new FechaImportante({
        tipo: data.tipo,
        fechaInicio: data.fechaInicio,
        fechaFin: data.fechaFin,
        descripcion: data.descripcion
      })

      return await fecha.save()
    }
  }
}