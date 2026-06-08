import { carreraDefs } from "./definitions/carreraDefs.js"
import { planEstudioDefs } from "./definitions/planEstudioDefs.js"
import { puntuacionDefs } from "./definitions/puntuacionDefs.js"
import { carreraResolver } from "./resolvers/carreraResolver.js"
import { puntuacionResolver } from "./resolvers/puntuacionResolver.js"
import { resolvers as userResolver, typeDefs as userDefs } from "./user.js"
import { resolvers as materiaResolver, typeDefs as materiaDefs } from "./materia.js"
import { resolvers as profesorResolver, typeDefs as profesorDefs } from "./profesor.js"
import { typeDefs as comisionDefs } from "./comision.js"



export const typeDefs = [
  userDefs,
  materiaDefs,
  carreraDefs(),
  comisionDefs,
  planEstudioDefs(),
  profesorDefs,
  puntuacionDefs()
]

export const resolvers = [
  userResolver,
  materiaResolver,
  carreraResolver(),
  profesorResolver,
  puntuacionResolver()
]