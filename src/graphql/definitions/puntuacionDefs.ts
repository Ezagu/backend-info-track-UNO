export const puntuacionDefs = () => {
  return `
    type Puntuacion {
      usuarioId: String!
      profesorId: String!
      puntuacion: Float!
      comentario: String
      fecha: String!
    }

    type Mutation {
      puntuarProfesor(profesorId: ID!, puntuacion: Float!, comentario: String): Puntuacion
    }
  `
}