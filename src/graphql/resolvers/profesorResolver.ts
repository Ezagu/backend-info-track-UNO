import type { Types } from "mongoose"
import { Profesor } from "../../database/models/Profesor.js"
import type { SearchInput } from "../../types/global.js"
import { normalizarString } from "../../helpers/normalizarString.js"
import type { IProfesor } from "../../types/profesor.js"
import { Materia } from "../../database/models/Materia.js"

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
        Profesor: {
            materias: async (root: IProfesor) => {
                return await Materia.find({_id: root.materias})
            }
        }
    }
}