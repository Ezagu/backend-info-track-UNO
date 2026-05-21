export const materiaDefs = () => {
  return `
    type Materia {
      id: ID!
      nombre: String!
      cargaHorariaTotal: Int
      cargaHorariaSemanal: Int
      electiva: Boolean
      linkCampus: String
      linkWhatsapp: String
      promocion: Boolean
      carreras: [Carrera]
      comisiones: [Comision]
      profesores: [Profesor]
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