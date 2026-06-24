import type { ICarrera } from "../types/carrera.js"
import type { Context } from "../types/auth.js"
import { Types } from "mongoose"
import { GraphQLError } from "graphql"
import { Carrera }  from "../database/models/Carrera.js"
import { User } from "../database/models/User.js"
import { PlanEstudio } from "../database/models/PlanEstudio.js"
import type { IMateria } from "../types/materia.js"

export const typeDefs = `
  type EstadisticasCarrera {
    carrera: Carrera!
    aprobadas: Int!
    promocionadas: Int!
    regularizadas: Int!
    cursando: Int!
    faltantes: Int!
    porcentajeCompletado: Float!
    promedio: Float
    materiasAprobadas: [MateriaUsuario]
    materiasPromocionadas: [MateriaUsuario]
    materiasRegularizadas: [MateriaUsuario]
    materiasCursando: [MateriaUsuario]
    materiasFaltantes: [Materia]
  }

  type MateriaCarrera {
    materia: Materia!
    anio: Int!
    cuatrimestre: Int!
  }

  type Carrera {
    id: ID!
    nombre: String!
    abreviacion: String!
    duracion: Float!
    descripcion: String
    tituloOtorgado: String!
    cargaHorariaTotal: Int!
    materias: [MateriaCarrera]
    cantidadMaterias: Int!
  }

  type Query {
    carreras: [Carrera]
    carrera(id: ID!): Carrera
    estadisticasPorCarrera(carreraId: ID!): EstadisticasCarrera
  }

  type Mutation {
    inscribirseEnCarrera(carreraId: ID!): Carrera
    darseBajaCarrera(carreraId: ID!): Carrera
  }
`

export const resolvers = {
  Query: {
    carreras: async () => { 
      const carreras = await Carrera.find()
      return carreras
    },
    carrera: async (_root: undefined, args: {id: string}) => {
      return await Carrera.findById(args.id)
    },
    estadisticasPorCarrera: async (_root: undefined, args: { carreraId: string }, { currentUser }: Context) => {
      if (!currentUser) throw new GraphQLError('Usuario no identificado', { extensions: { code: "UNAUTHORIZED" } })

      const carrera = await Carrera.findById(args.carreraId)
      if (!carrera) throw new GraphQLError('Carrera no encontrada', { extensions: { code: 'CARRERA_NOT_FOUND' } })

      const todasLasMaterias = await PlanEstudio.find({ carreraId: carrera.id }).populate<{ materiaId: IMateria }>("materiaId")
      const idsMaterias = todasLasMaterias.map(materia => materia.materiaId.id)

      const materiasUsuario = currentUser.materias.filter(m => idsMaterias.includes(m.materiaId))

      const materiasAprobadas = materiasUsuario.filter(m => m.estado === "APROBADA")
      const materiasPromocionadas = materiasUsuario.filter(m => m.estado === "PROMOCIONADA")
      const materiasRegularizadas = materiasUsuario.filter(m => m.estado === "REGULARIZADA")
      const materiasCursando = materiasUsuario.filter(m => m.estado === "CURSANDO")

      const idsConEstado = materiasUsuario.map(m => m.materiaId)
      const planEstudioFaltantes = todasLasMaterias.filter(pe => !idsConEstado.includes(pe.materiaId.id))
      const materiasFaltantes = planEstudioFaltantes.map(pe => pe.materiaId)

      const conNota = [...materiasAprobadas, ...materiasPromocionadas].filter(m => m.notaFinal != null)
      const promedio = conNota.length > 0
        ? (conNota.reduce((acc, m) => acc + m.notaFinal!, 0) / conNota.length).toFixed(2)
        : null

      const porcentajeCompletado = (((materiasAprobadas.length + materiasPromocionadas.length) / todasLasMaterias.length) * 100).toFixed(2)

      return {
        carrera,
        aprobadas: materiasAprobadas.length,
        promocionadas: materiasPromocionadas.length,
        regularizadas: materiasRegularizadas.length,
        cursando: materiasCursando.length,
        faltantes: materiasFaltantes.length,
        porcentajeCompletado,
        promedio,
        materiasAprobadas,
        materiasPromocionadas,
        materiasRegularizadas,
        materiasCursando,
        materiasFaltantes
      }
    }
  },
  Mutation: {
    inscribirseEnCarrera: async (_root: undefined, args: {carreraId: string}, context: Context) => {
      // Validar que el usuario esté logueado
      if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})

      // Validar que la carrera exista
      const carrera = await Carrera.findById(args.carreraId)
      if(!carrera) throw new GraphQLError('Carrera no encontrada', {extensions: {code: 'CARRERA_NOT_FOUND'}})

      const user = await User.findById(context.currentUser.id)

      // Validar que el usuario no esté inscripto
      const carreraExists = user?.carreras.find(c => c.toString() === args.carreraId)
      if(carreraExists) throw new GraphQLError('Usuario ya inscripto en la carrera', {extensions: {code: 'CONFLICT'}})


      user?.carreras.push(new Types.ObjectId(args.carreraId))
      return await user?.save()
    },
    darseBajaCarrera: async (_root: undefined, args: {carreraId: string}, context: Context) => {
      // Validar que el usuario esté logueado
      if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})

      const user = await User.findById(context.currentUser.id)
      if(!user) throw new GraphQLError('Usuario no identificado no encontrado', {extensions: {code: 'USER_NOT_FOUND'}})
      
      // Validar que el usuario este en la carrera
      const carreraIndex = user.carreras.findIndex(c => c.toString() === args.carreraId)
      if(carreraIndex === -1) throw new GraphQLError('El usuario no esta inscripto en la carrera', {extensions: {code: 'CARRERA_NOT_FOUND'}})

      user.carreras.splice(carreraIndex, 1)
      return await user.save()
    }
  },
  Carrera: {
    materias: async (root: ICarrera) => {
        const planEstudio = await PlanEstudio.find({carreraId: root._id}).populate('materiaId')
        return planEstudio.map(plan => ({
            materia: plan.materiaId,
            anio: plan.anio,
            cuatrimestre: plan.cuatrimestre,
        }))
    },
    cantidadMaterias: async(root: ICarrera) => {
        return await PlanEstudio.countDocuments({carreraId: root._id})
    }
  }
}