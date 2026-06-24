import { FechaImportante } from "../database/models/FechaImportante.js"
import { validateFechaImportanteInput } from "../validators/fechaImportanteValidator.js"
import { getNombreMes } from "../helpers/meses.js"

export const typeDefs = `
  type FechasPorMes {
    mes: String!      
    anio: Int!
    fechas: [FechaImportante!]!
  }

  type FechaImportante {
    id: ID!
    titulo: String!
    fechaInicio: String!
    fechaFin: String
    descripcion: String!
  }

  type Query {
    fechasImportantes: [FechaImportante]
    fechasImportantesPorMes: [FechasPorMes]
  }

  type Mutation {
    crearFechaImportante(
      titulo: String!
      fechaInicio: String!
      fechaFin: String
      descripcion: String!
    ): FechaImportante
  }
`

export const resolvers = {
  Query: {
    fechasImportantes: async () => {
      const hoy = new Date()

      return await FechaImportante.find({
        $or: [
          {fechaFin: { $gte: hoy }},
          {fechaFin: null, fechaInicio: { $gte: hoy }}
        ]
      }).sort({fechaInicio: 1})
    },
    fechasImportantesPorMes: async () => {
      const hoy = new Date()

      const fechas = await FechaImportante.find({
        $or: [
          { fechaFin: { $gte: hoy } },
          { fechaFin: null, fechaInicio: { $gte: hoy } }
        ]
      }).sort({ fechaInicio: 1 })

      // Agrupar por año-mes
      const grupos = new Map<string, { anio: number; mes: string; fechas: typeof fechas }>()

      for (const fecha of fechas) {
        const anio = fecha.fechaInicio.getFullYear()
        const mes = fecha.fechaInicio.getMonth() + 1  // getMonth() es 0-indexed
        const key = `${anio}-${mes}`

        if (!grupos.has(key)) {
          grupos.set(key, { anio, mes: getNombreMes(mes), fechas: [] })
        }
        grupos.get(key)!.fechas.push(fecha)
      }

      return Array.from(grupos.values())
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