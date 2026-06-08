export const carreraDefs = () => {
  return `
    type EstadisticasCarrera {
      carrera: Carrera!
      aprobadas: Int!
      promocionadas: Int!
      regularizadas: Int!
      cursando: Int!
      faltantes: Int!
      porcentajeCompletado: Float!
      promedio: Float
      materiasAprobadas: [MateriaUsuario]
      materiasPromocionadas: [MateriaUsuario]
      materiasRegularizadas: [MateriaUsuario]
      materiasCursando: [MateriaUsuario]
      materiasFaltantes: [Materia]
    }

    type MateriaCarrera {
      materia: Materia!
      anio: Int!
      cuatrimestre: Int!
    }

    type Carrera {
      id: ID!
      nombre: String!
      abreviacion: String!
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
      estadisticasPorCarrera: [EstadisticasCarrera]
    }

    type Mutation {
      inscribirseEnCarrera(carreraId: ID!): Carrera
      darseBajaCarrera(carreraId: ID!): Carrera
    }
  ` 
}