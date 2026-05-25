import type { EstablecerEstadoMateria, EstadoMateria, IUser, LoginUser, MateriaUser, RegisterUser } from "../../types/user.js"
import type { Context } from "../../types/auth.js"
import type { IPuntuacion } from "../../types/puntuacion.js"
import { Types } from "mongoose"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { GraphQLError } from "graphql"
import { User } from "../../database/models/User.js"
import { Materia } from "../../database/models/Materia.js"
import { validateLoginInput, validateRegisterInput, validateEstadoMateriaInput } from "../../validators/userValidator.js"
import { Carrera } from "../../database/models/Carrera.js"
import { Puntuacion } from "../../database/models/Puntacion.js"
import { Profesor } from "../../database/models/Profesor.js"

export const userResolver = () => {
  return {
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
        
        if(args.carreraId) {
          // Comprobar que exista la carrera
          const carrera = await Carrera.findById(args.carreraId)
          if(!carrera) throw new GraphQLError('La carrera no existe', {extensions: {code: 'CARRERA_NOT_FOUND'}})

          user.carreras.push(carrera._id)
        }
        
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
      establecerEstadoMateria: async (_root: undefined, args: EstablecerEstadoMateria, context: Context) => {
        // Verificamos que este logueado
        if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: "UNAUTHORIZED"}})

        // Validar Inputs
        const data = validateEstadoMateriaInput(args)

        // Validamos que exista la materia
        const materia = await Materia.findById(data.materiaId)
        if(!materia) throw new GraphQLError('La materia no existe', {extensions: {code: "MATERIA_NOT_FOUND"}})

        // Creamos la nueva materia
        const newMateria: MateriaUser = {
          materiaId: data.materiaId,
          estado: data.estado as EstadoMateria,
          cuatrimestre: data.cuatrimestre,
          anio: data.anio,
          notaFinal: null,
          llamadosUsados: null,
          vencimiento: null
        }

        // Agregar datos si el estado es regularizada
        if(data.estado === "REGULARIZADA") {
          newMateria.llamadosUsados = 0
          newMateria.vencimiento = new Date(data.anio + 2, data.cuatrimestre === 1 ? 3 : 8, 1)
        }

        // Agregar datos si el estado es aprobada o promocionada
        if(data.estado === "APROBADA" || data.estado === "PROMOCIONADA") {
          if(!data.nota) throw new GraphQLError('Debes ingresar una nota numérica', {extensions: {code: 'MISSING_ARGUMENT'}})
          newMateria.notaFinal = data.nota
        }

        // Buscamos el usuario
        const user = await User.findById(context.currentUser.id)
        if(!user) throw new GraphQLError('Usuario no encontrado', {extensions: {code: 'USER_NOT_FOUND'}})

        // Buscamos si existe estado de materia en el usuario
        const materiaIndex = user.materias?.findIndex(materia => materia.materiaId?.toString() === data.materiaId)

        if(materiaIndex === -1) {
          // No existe la materia en el usuario
          user.materias.push(newMateria)
        } else {
          user.materias[materiaIndex]?.set(newMateria)
        }

        await user.save()
        return user
      },
      inscribirseEnCarrera: async (_root: undefined, args: {carreraId: string}, context: Context) => {
        // Validar que el usuario esté logueado
        if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})

        // Validar que la carrera exista
        const carrera = await Carrera.findById(args.carreraId)
        if(!carrera) throw new GraphQLError('Carrera no encontrada', {extensions: {code: 'CARRERA_NOT_FOUND'}})

        const user = await User.findById(context.currentUser.id)

        // Validar que el usuario no esté inscripto
        const carreraExists = user?.carreras.find(c => c.toString() === args.carreraId)
        if(carreraExists) throw new GraphQLError('Usuario ya inscripto en la carrera', {extensions: {code: 'CONFLICT'}})


        user?.carreras.push(new Types.ObjectId(args.carreraId))
        return await user?.save()
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
}