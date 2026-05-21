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
            linkCampus: String
            ratings: [Rating]
            materias: [Materia]!
        }
    `
}