export const profesorDefs = () =>{
    return `
        type PuntuacionProfesor {
            id: ID!
            usuario: Usuario!
            puntuacion: Float!
            comentario: String
            fecha: String
        }

        type Profesor {
            id: ID!
            nombre: String!
            email: String!
            puntuaciones: [PuntuacionProfesor]
            materias: [Materia]!
            cantidadPuntuaciones: Int!
            promedioPuntuaciones: Float
        }
            
        type Query {
            profesor(id: ID!): Profesor
            profesores(search: String, limit: Int, page: Int): [Profesor]
        }
    `
}