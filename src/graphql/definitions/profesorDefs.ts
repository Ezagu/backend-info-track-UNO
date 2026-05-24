export const profesorDefs = () =>{
    return `
        type Puntuacion {
            id: ID!
            usuario: Usuario!
            puntuacion: Float!
            comentario: String
        }

        type Profesor {
            id: ID!
            nombre: String!
            email: String!
            puntuaciones: [Puntuacion]
            materias: [Materia]!
            cantidadPuntuaciones: Int!
            promedioPuntuaciones: Float
        }
            
        type Query {
            profesor(id: ID!): Profesor
            profesores(search: String, limit: Int, page: Int): [Profesor]
        }

        type Mutation {
            puntuarProfesor(profesorId: ID!, puntuacion: Float!, comentario: String): Profesor
        }
    `
}