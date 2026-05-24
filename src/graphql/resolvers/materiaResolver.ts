import { Comision } from "../../database/models/Comision.js"
import { Materia } from "../../database/models/Materia.js"
import { PlanEstudio } from "../../database/models/PlanEstudio.js"
import { Profesor } from "../../database/models/Profesor.js"
import type { IMateria, SearchMateriaInput } from "../../types/materia.js"

export const materiaResolver = () => {
  return {
    Query: {
      materias: async (_root: undefined, args: SearchMateriaInput) => {
        const {search = "", page = 1, limit = 10} = args

        // Filtramos con el search y hacemos paginación
        const materias = await Materia.find(
          {nombreNormalizado: {
            $regex: search,
            $options: 'i'
          }}
        )
        .skip((page-1) * limit)
        .limit(limit)

        return materias
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
      carreras: async (root: IMateria) => {
        // Encuentra los planes de estudio (relacion entre carrera y materia) que se encuentra la materia
        const planEstudio = await PlanEstudio.find({materiaId: root.id}).populate("carreraId")
        // Mapea las carreras y las retorna
        return planEstudio.map(pe => pe.carreraId)
      },
      comisiones: async (root: IMateria) => {
        // Encuentra todas las comisiones que le perteneces a la materia
        return await Comision.find({materiaId: root.id})
      },
      profesores: async (root: IMateria) => {
        return await Profesor.find({materias: root.id})
      }
    }
  }
}