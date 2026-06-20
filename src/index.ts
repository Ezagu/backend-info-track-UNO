import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import dotenv from "dotenv"
import { connect } from "./database/connection.js"
import { typeDefs, resolvers } from "./graphql/index.js"
import { context } from "./graphql/context.js"
import type { Context } from "./types/auth.js"

// Importa las variables de entorno
dotenv.config()

// Conectarse a la base de datos
connect()

//Crear server
const server = new ApolloServer<Context>({typeDefs, resolvers})

//Levantar server
const { url } = await startStandaloneServer(server, {context})

console.log('Servidor corriendo en:', url)