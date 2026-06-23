import type { IUser, LoginUser, MateriaUser, RegisterUser } from "../types/user.js"
import type { Context } from "../types/auth.js"
import type { IPuntuacion } from "../types/puntuacion.js"
import { Types } from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { GraphQLError } from "graphql"
import { User } from "../database/models/User.js"
import { Materia } from "../database/models/Materia.js"
import { validateLoginInput, validateRegisterInput, validateEstadoMateriaInput, validateActualizarUsuario } from "../validators/userValidator.js"
import { Carrera } from "../database/models/Carrera.js"
import { Puntuacion } from "../database/models/Puntacion.js"
import { Profesor } from "../database/models/Profesor.js"

export const typeDefs = `
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

  type Vencimiento {
    fecha: Int
    anio: Int
  }

  type MateriaUsuario {
    materia: Materia!
    anio: Int
    cuatrimestre: Int
    notaFinal: Int
    estado: EstadoMateria!
    llamadosUsados: Int
    vencimiento: Vencimiento
    updatedAt: String
    createdAt: String
  }

  type PuntuacionUsuario {
    id: ID!
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
    promedioGeneral: Float
    materias: [MateriaUsuario]
    carreras: [Carrera]
    puntuaciones: [PuntuacionUsuario]
  }

  type Query {
    me: Usuario
  }

  type Mutation {
    registrarUsuario(nombre: String!, apellido: String!, password: String!, email: String!, carreraId: ID!, anioIngreso: Int): Usuario
    loguearUsuario(email: String!, password: String!): String
    modificarUsuario(nombre: String, apellido: String, anioIngreso: Int): Usuario
  }
`

export const resolvers = {
  Query: {
    me: (_root: undefined, _args: undefined, context: Context) => {
      if(!context.currentUser) throw new Error('USUARIO NO IDENTIFICADO')
      return context.currentUser
    }
  },
  Mutation: {
    registrarUsuario: async (_root: undefined, args: RegisterUser) => {
      // Validar datos
      const data = validateRegisterInput(args)
      
      // Comprobar si ya existe un usuario con el mismo mail
      const userExiste = await User.findOne({email: data.email})
      if(userExiste) throw new GraphQLError('El usuario ya existe', {
        extensions: {code: 'USER_ALREADY_EXISTS'}
      })

      // Cifrar la contraseña
      const passwordCifrada = bcrypt.hashSync(data.password, 10)

      const user = new User({
        nombre: data.nombre,
        apellido: data.apellido,
        email: data.email,
        password: passwordCifrada
      })
      
      if(data.carreraId) {
        // Comprobar que exista la carrera
        const carrera = await Carrera.findById(data.carreraId)
        if(!carrera) throw new GraphQLError('La carrera no existe', {extensions: {code: 'CARRERA_NOT_FOUND'}})

        user.carreras.push(carrera._id)
      }

      if(data.anioIngreso) user.anioIngreso = data.anioIngreso
      
      await user.save()
      return user
    },
    loguearUsuario: async (_root: undefined, args: LoginUser) => {
      // Validar datos
      const data = validateLoginInput(args)

      // Validar que exista el usuario
      const userExiste = await User.findOne({email: data.email})
      if(!userExiste) throw new GraphQLError('Usuario no existe', {
        extensions: { code: 'USER_NOT_FOUND' }
      })

      // Validar la contraseña
      const passwordValidada = bcrypt.compareSync(data.password, userExiste.password)
      if(!passwordValidada) throw new GraphQLError('Contraseña incorrecta', {
        extensions: {code: 'INVALID_CREDENTIALS'}
      })
      
      // Crear token
      const privateKey = process.env.JWT_SECRET
      if(!privateKey) throw new Error('Error al cargar variables de entorno')

      return jwt.sign({id: userExiste._id}, privateKey)
    },
    modificarUsuario: async (_root: undefined, args: {carreraId: string}, context: Context) => {
      // Validar que el usuario esté logueado
      if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})

      // Validar datos
      const data = validateActualizarUsuario(args)

      // Validar que hayan enviado datos para actualizar
      if(Object.keys(data).length === 0) throw new GraphQLError('No hay datos para actualizar', {extensions: {code: 'MISSING_ARGUMENT'}})

      // Actualizar usuario
      return await User.findByIdAndUpdate(context.currentUser.id, data, {returnDocument: 'after', runValidators: true})
    }
  },
  Usuario: {
    promedioGeneral: (root: IUser) => {
      let sum = 0
      let cant = 0
      root.materias.forEach(m => {
        if(m.notaFinal) {
          sum += m.notaFinal
          cant++
        }
      })
      if(cant === 0) return null
      return (sum / cant).toFixed(2)
    },
    carreras: async (root: IUser) => {
      return await Carrera.find({_id: root.carreras})
    },
    puntuaciones: async (root: IUser) => {
      return await Puntuacion.find({usuarioId: root.id})
    },
    siglas: (root: IUser) => {
      return root.nombre.slice(0,1) + root.apellido.slice(0,1)
    }
  },
  MateriaUsuario: {
    materia: async (root: MateriaUser) => {
      return await Materia.findById(root.materiaId)
    }
  },
  PuntuacionUsuario: {
    profesor: async (root: IPuntuacion) => {
      return await Profesor.findById(root.profesorId)
    }
  }
}