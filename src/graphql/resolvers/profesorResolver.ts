import type { Types } from "mongoose"
import { Profesor } from "../../database/models/Profesor.js"

export const profesorResolver = () =>{
    return {
        Query: {
            profesor: async (_root: undefined, args: {id: Types.ObjectId}) => {
                return await Profesor.findById(args.id)
            }
        }
    }
}