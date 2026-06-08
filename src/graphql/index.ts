import { carreraDefs } from "./definitions/carreraDefs.js"
import { comisionDefs } from "./definitions/comisionDefs.js"
import { materiaDefs } from "./definitions/materiaDefs.js"
import { planEstudioDefs } from "./definitions/planEstudioDefs.js"
import { profesorDefs } from "./definitions/profesorDefs.js"
import { puntuacionDefs } from "./definitions/puntuacionDefs.js"
import { carreraResolver } from "./resolvers/carreraResolver.js"
import { materiaResolver } from "./resolvers/materiaResolver.js"
import { profesorResolver } from "./resolvers/profesorResolver.js"
import { puntuacionResolver } from "./resolvers/puntuacionResolver.js"
import { resolvers as userResolver, typeDefs as userDefs } from "./user.js"

export const typeDefs = [
  userDefs,
  materiaDefs(),
  carreraDefs(),
  comisionDefs(),
  planEstudioDefs(),
  profesorDefs(),
  puntuacionDefs()
]

export const resolvers = [
  userResolver,
  materiaResolver(),
  carreraResolver(),
  profesorResolver(),
  puntuacionResolver()
]