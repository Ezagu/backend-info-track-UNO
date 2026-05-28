export const materiaDefs = () => {
  return `
    type PlanEstudioMateria {
      carrera: Carrera
      anio: Int!
      cuatrimestre: Int!
    }

    type Materia {
      id: ID!
      nombre: String!
      cargaHorariaTotal: Int
      cargaHorariaSemanal: Int
      linkWhatsapp: String
      promocion: Boolean
      correlativas: [Materia]
      planEstudio: [PlanEstudioMateria]
      comisiones: [Comision]
      profesores: [Profesor]
      carreras: [Carrera]
    }

    type Query {
      materias(search: String, page: Int, limit: Int): [Materia]
      materia(id: ID!): Materia
    }

    type Mutation {
      createMateria(nombre: String!, codigo: String!, cargaHoraria: Int!, electiva: Boolean, linkCampus: String, linkWhatsapp: String, promocion: Boolean): Materia
      deleteMateria(id: String!): Materia
    }
  `
}