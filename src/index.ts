import type { JwtPayload } from "./types/auth.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { connect } from "./database/connection.js"
import { userDefs } from "./graphql/definitions/userDefs.js"
import { materiaDefs } from "./graphql/definitions/materiaDefs.js"
import { userResolver } from "./graphql/resolvers/userResolver.js"
import { materiaResolver } from "./graphql/resolvers/materiaResolver.js"
import { carreraDefs } from "./graphql/definitions/carreraDefs.js"
import { comisionDefs } from "./graphql/definitions/comisionDefs.js"
import { carreraResolver } from "./graphql/resolvers/carreraResolver.js"
import { planEstudioDefs } from "./graphql/definitions/planEstudioDefs.js"
import { profesorDefs } from "./graphql/definitions/profesorDefs.js"
import { profesorResolver } from "./graphql/resolvers/profesorResolver.js"
import { User } from "./database/models/User.js"

// Importa las variables de entorno
dotenv.config()

// Conectarse a la base de datos
connect()

const typeDefs = [
  userDefs(),
  materiaDefs(),
  carreraDefs(),
  comisionDefs(),
  planEstudioDefs(),
  profesorDefs()
]

const resolvers = [
  userResolver(),
  materiaResolver(),
  carreraResolver(),
  profesorResolver()
]

//Crear server
const server = new ApolloServer({
  typeDefs,
  resolvers
})

//Levantar server
const { url } = await startStandaloneServer(server, {
  context: async ({req}) => {
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
      return { currentUser: user }
    }
    return {}
  }
})

console.log('Servidor corriendo en:', url)