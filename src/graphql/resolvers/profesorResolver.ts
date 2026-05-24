import type { Types } from "mongoose"
import { Profesor } from "../../database/models/Profesor.js"
import type { SearchInput } from "../../types/global.js"
import { normalizarString } from "../../helpers/normalizarString.js"

export const profesorResolver = () =>{
    return {
        Query: {
            profesor: async (_root: undefined, args: {id: Types.ObjectId}) => {
                return await Profesor.findById(args.id)
            },
            profesores: async (_root: undefined, args: SearchInput) => {
                const {search = "", limit = 10, page = 1} = args

                const searchNormalizado = normalizarString(search)
                console.log(searchNormalizado)

                // Filtramos con el search y hacemos paginación
                return await Profesor.find(
                    {nombreNormalizado: {$regex: searchNormalizado, $options: 'i'}}
                )
                .skip((page - 1) * limit)
                .limit(limit)
            }
        }
    }
}