export const planEstudioDefs = () => {
    return `
        type PlanEstudio {
            id: ID!
            carreraId: String!
            materiaId: String!
            anio: Int!
            cuatrimestre: Int!
        }
    `
}