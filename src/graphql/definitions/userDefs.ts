export const userDefs = () => {
  return `
    enum EstadoMateria {
      APROBADA
      REGULARIZADA
      CURSANDO
      PROMOCIONADA
    }

    enum RolUsuario {
      USER
      ADMIN
    }

    type MateriaUsuario {
      materia: Materia!
      anio: Int!
      cuatrimestre: Int!
      notaFinal: Int
      estado: EstadoMateria!
      llamadosUsados: Int
      vencimiento: String
    }

    type PuntuacionUsuario {
      profesor: Profesor
      puntuacion: Float!
      comentario: String
      fecha: String!
    }

    type Usuario {
      id: ID!
      nombre: String!
      apellido: String!
      siglas: String!
      email: String!
      rol: RolUsuario!
      anioIngreso: Int
      materias: [MateriaUsuario]
      carreras: [Carrera]
      promedioGeneral: Float
      puntuaciones: [PuntuacionUsuario]
    }

    type Query {
      me: Usuario
      materiasACursarProximoCuatrimestre: [Materia]
    }

    type Mutation {
      registrarUsuario(nombre: String!, apellido: String!, password: String!, email: String!, carreraId: ID!, anioIngreso: Int): Usuario
      loguearUsuario(email: String!, password: String!): String
      establecerEstadoMateria(materiaId: String!, estado: EstadoMateria!, anio: Int!, cuatrimestre: Int!, nota: Int): Usuario
      inscribirseEnCarrera(carreraId: ID!): Usuario
      eliminarEstadoMateria(materiaId: String!): Usuario
      registrarLlamado(materiaId: String!, notaFinal: Int!): Usuario
      darseBajaCarrera(carreraId: ID!): Usuario
      modificarUsuario(nombre: String, apellido: String, anioIngreso: Int): Usuario
    }
  `
}