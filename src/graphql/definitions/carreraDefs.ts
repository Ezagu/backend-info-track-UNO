export const carreraDefs = () => {
    return `
    type MateriaCarrera {
        materia: Materia!
        anio: Int!
        cuatrimestre: Int!
        correlativas: [Materia]
    }

    type Carrera {
        id: ID!
        nombre: String!
        duracion: Int!
        descripcion: String
        tituloOtorgado: String!
        cargaHorariaTotal: Int!
        materias: [MateriaCarrera]
        cantidadMaterias: Int!
    }

    type Query {
        carreras: [Carrera]
        carrera(id: ID!): Carrera
    }
` 
}