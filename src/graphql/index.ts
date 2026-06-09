import { resolvers as fechaImportanteResolver, typeDefs as fechaImportanteDefs } from "./fechaImportante.js"
import { resolvers as userResolver, typeDefs as userDefs } from "./user.js"
import { resolvers as materiaResolver, typeDefs as materiaDefs } from "./materia.js"
import { resolvers as carreraResolver, typeDefs as carreraDefs } from "./carrera.js"
import { resolvers as profesorResolver, typeDefs as profesorDefs } from "./profesor.js"
import { resolvers as puntuacionResolver, typeDefs as puntuacionDefs } from "./puntuacion.js"
import { typeDefs as comisionDefs } from "./comision.js"
import { typeDefs as planEstudioDefs } from "./planEstudio.js"

export const typeDefs = [
  userDefs,
  materiaDefs,
  carreraDefs,
  comisionDefs,
  planEstudioDefs,
  profesorDefs,
  puntuacionDefs,
  fechaImportanteDefs
]

export const resolvers = [
  userResolver,
  materiaResolver,
  carreraResolver,
  profesorResolver,
  puntuacionResolver,
  fechaImportanteResolver
]