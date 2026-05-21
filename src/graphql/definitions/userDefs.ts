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

    type Usuario {
      id: ID!
      nombre: String!
      apellido: String!
      email: String!
      rol: RolUsuario!
      anioIngreso: Int
      materias: [MateriaUsuario]
    }

    type Query {
      me: Usuario
    }

    type Mutation {
      registrarUsuario(nombre: String!, apellido: String!, password: String!, email: String!): Usuario
      loguearUsuario(email: String!, password: String!): String
      establecerEstadoMateria(idMateria: String!, estado: EstadoMateria!, anio: Int!, cuatrimestre: Int!, nota: Int): Usuario
    }
  `
}