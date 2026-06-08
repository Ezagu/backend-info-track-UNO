import type { JwtPayload } from "../types/auth.js"
import type { StandaloneServerContextFunctionArgument } from "@apollo/server/standalone"
import jwt from "jsonwebtoken"
import { User } from "../database/models/User.js"
import { GraphQLError } from "graphql"


export const context = async ({req}: StandaloneServerContextFunctionArgument) => {
    // Recibir token de la cabecera de la request
    const token = req.headers.authorization
    if (token) {
      // Cargar variable de entorno
      const secretKey = process.env.JWT_SECRET
      if(!secretKey) throw new Error('Secret key no cargada')

      // Decodificar token
      const {id} = jwt.verify(token, secretKey) as JwtPayload
      
      // Buscar usuario y retornarlo
      const user = await User.findById(id);
      if(!user) throw new GraphQLError('Error al buscar usuario identificado', {extensions: {code: 'USER_NOT_FOUND'}})
      return { currentUser: user }
    }
    return { currentUser: undefined }
  }