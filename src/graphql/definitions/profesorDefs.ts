export const profesorDefs = () =>{
    return `
        type Rating {
            userId: String!
            puntuacion: Float!
            comentario: String
        }

        type Profesor {
            id: ID!
            nombre: String!
            email: String!
            ratings: [Rating]
            materias: [Materia]!
        }
            
        type Query {
            profesor(id: ID!): Profesor
            profesores(search: String, limit: Int, page: Int): [Profesor]
        }
    `
}