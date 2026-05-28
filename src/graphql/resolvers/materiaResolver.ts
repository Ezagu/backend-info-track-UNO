import type { IMateria} from "../../types/materia.js"
import type { IPlanEstudio } from "../../types/planEstudio.js"
import type { SearchInput } from "../../types/global.js"
import { Comision } from "../../database/models/Comision.js"
import { Materia } from "../../database/models/Materia.js"
import { PlanEstudio } from "../../database/models/PlanEstudio.js"
import { Profesor } from "../../database/models/Profesor.js"
import { normalizarString } from "../../helpers/normalizarString.js"
import { Carrera } from "../../database/models/Carrera.js"


export const materiaResolver = () => {
  return {
    Query: {
      materias: async (_root: undefined, args: SearchInput) => {
        const {search = "", page = 1, limit = 10} = args

        // Le sacamos las tildes al search
        const searchNormalizado = normalizarString(search)
        // Filtramos con el search y hacemos paginación
        return await Materia.find(
          {nombreNormalizado: {$regex: searchNormalizado, $options: 'i'}}
        )
        .skip((page - 1) * limit)
        .limit(limit)
      },
      materia: async (_root: undefined, args: {id: string}) => {
        return await Materia.findById(args.id)
      }
    },
    Mutation: {
      createMateria: async (root: undefined, data: undefined) => {
        // TODO: VALIDACION DE DATOS
  
        // Creamos la materia
        const materia = new Materia(data)
        // La guardamos en la base de datos
        await materia.save()
        return materia
      },
      deleteMateria: async (root: undefined, data: {id: string}) => {
        const {id} = data
        const materia = await Materia.findByIdAndDelete(id)
        return materia
      }
    },
    Materia: {
      comisiones: async (root: IMateria) => {
        // Encuentra todas las comisiones que le perteneces a la materia
        return await Comision.find({materiaId: root.id})
      },
      profesores: async (root: IMateria) => {
        return await Profesor.find({materias: root.id})
      },
      planEstudio: async (root: IMateria) => {
        return await PlanEstudio.find({materiaId: root.id})
      },
      correlativas: async (root: IMateria) => {
        return await Materia.find({_id: root.correlativas}) 
      },
      carreras: async (root: IMateria) => {
        const planEstudio = await PlanEstudio.find({materiaId: root.id}).populate('carreraId')
        return planEstudio.map(plan => (plan.carreraId))
      },
      cuatrimestreDictado: async (root: IMateria) => {
        const comisiones = await Comision.find({
          materiaId: root.id
        }).distinct('cuatrimestre')
        return comisiones
      }
    },
    PlanEstudioMateria: {
      carrera: async (root: IPlanEstudio) => {
        return await Carrera.findById(root.carreraId)
      }
    }
  }
}