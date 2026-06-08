import type { IMateria} from "../../types/materia.js"
import type { IPlanEstudio } from "../../types/planEstudio.js"
import type { SearchInput } from "../../types/global.js"
import { Comision } from "../../database/models/Comision.js"
import { Materia } from "../../database/models/Materia.js"
import { PlanEstudio } from "../../database/models/PlanEstudio.js"
import { Profesor } from "../../database/models/Profesor.js"
import { normalizarString } from "../../helpers/normalizarString.js"
import { Carrera } from "../../database/models/Carrera.js"
import { GraphQLError } from "graphql"
import type { Context } from "../../types/auth.js"
import { validateEstadoMateriaInput } from "../../validators/userValidator.js"
import type { EstablecerEstadoMateria, EstadoMateria, MateriaUser } from "../../types/user.js"
import { User } from "../../database/models/User.js"


export const materiaResolver = () => {
  return {
    Query: {
      materias: async (_root: undefined, args: SearchInput) => {
        const {search = "", page = 1, limit = 10} = args

        // Le sacamos las tildes al search
        const searchNormalizado = normalizarString(search)
        // Filtramos con el search y hacemos paginación
        return await Materia.find(
          {nombreNormalizado: {$regex: searchNormalizado, $options: 'i'}}
        )
        .skip((page - 1) * limit)
        .limit(limit)
      },
      materia: async (_root: undefined, args: {id: string}) => {
        return await Materia.findById(args.id)
      },
      materiasACursarProximoCuatrimestre: async (_root: undefined, _args: undefined, {currentUser}: Context) => {
        // Verificamos que este logueado
        if(!currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: "UNAUTHORIZED"}})
  
        const idsMateriasEnCondicion = currentUser.materias.map(m => m.materiaId)
        const materiasCarrerasUsuario = await PlanEstudio.find({ carreraId: currentUser.carreras}).select("materiaId")
  
        // Materias de las carreras que todavia no curse
        const idsMateriasCarrerasUsuario = materiasCarrerasUsuario.map(m => {
          if(!idsMateriasEnCondicion.includes(m.materiaId)) {
            return m.materiaId
          }
        })
  
        const mes = new Date().getMonth() + 1
        const cuatrimestre = (mes >= 3 && mes <= 7) ? 2 : 1
        const year = new Date().getFullYear()
        const anio = cuatrimestre === 1 ? year : year - 1
  
        const idsResultados = await Promise.all(
          idsMateriasCarrerasUsuario.map(async (materiaId) => {
            if (materiaId === undefined) return null;
  
            const materia = await Materia.findById(materiaId);
            if (!materia) return null;
            
            // Ver si tengo correlativas
            const tengoCorrelativas = materia.correlativas.every(c =>
              idsMateriasEnCondicion.includes(c)
            );
  
            if (!tengoCorrelativas) return null
  
            // Verificar si se dicta el próximo cuatrimestre
            const seDicta = await Comision.findOne({materiaId, cuatrimestre, anio})
            if(!seDicta) return null
            return materiaId
          })
        )
        const idsFiltrados = idsResultados.filter(id => id !== null)
        return await Materia.find({_id: idsFiltrados})
      },
      proximosVencimientos: async(_root: undefined, _args: undefined, {currentUser}: Context) => {
        // Verificamos que este logueado
        if(!currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: "UNAUTHORIZED"}})
  
        return currentUser.materias
          .filter(materia => materia.estado === "REGULARIZADA")
          .sort((a,b) => {
            const fechaA = a.vencimiento ? new Date(a.vencimiento).getTime() : Infinity;
            const fechaB = b.vencimiento ? new Date(b.vencimiento).getTime() : Infinity;
            return fechaA - fechaB
          })
      }
    },
    Mutation: {
      createMateria: async (root: undefined, data: undefined) => {
        // TODO: VALIDACION DE DATOS
  
        // Creamos la materia
        const materia = new Materia(data)
        // La guardamos en la base de datos
        await materia.save()
        return materia
      },
      deleteMateria: async (root: undefined, data: {id: string}) => {
        const {id} = data
        const materia = await Materia.findByIdAndDelete(id)
        return materia
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
          if(data.nota < 4) throw new GraphQLError('Para promocionar o aprobar la nota debe ser superior a 4', {extensions: {code: 'CONFLICT'}})
          if(data.estado === "PROMOCIONADA" && data.nota < 7) throw new GraphQLError('Para promocionar la nota debe ser superior a 7', {extensions: {code: 'CONFLICT'}})
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
      eliminarEstadoMateria: async (_root: undefined, args: {materiaId: string}, context: Context) => {
        // Validar que el usuario esté logueado
        if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})
  
        const user = await User.findById(context.currentUser.id)
        if(!user) throw new GraphQLError('Usuario no identificado no encontrado', {extensions: {code: 'USER_NOT_FOUND'}})
        const materiaIndex = user.materias.findIndex(m => m.materiaId.toString() === args.materiaId)
  
        // Validar que el usuario tenga la materia
        if(materiaIndex === -1) throw new GraphQLError('El usuario no tiene registrada esta materia', {extensions: {code: 'MATERIA_NOT_FOUND'}})
  
        // Eliminar materia
        user.materias.splice(materiaIndex, 1)
        return await user.save()
      },
      registrarLlamado: async (_root: undefined, args: {materiaId: string, notaFinal: number}, context: Context) => {
        // Validar que el usuario esté logueado
        if(!context.currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: 'UNAUTHORIZED'}})
  
        const user = await User.findById(context.currentUser.id)
        if(!user) throw new GraphQLError('Usuario no identificado no encontrado', {extensions: {code: 'USER_NOT_FOUND'}})
        const materiaIndex = user.materias.findIndex(m => m.materiaId.toString() === args.materiaId)
        const materia = user.materias[materiaIndex]
  
        // Validar que el usuario tenga la materia
        if(materiaIndex === -1) throw new GraphQLError('El usuario no tiene registrada esta materia', {extensions: {code: 'MATERIA_NOT_FOUND'}}) 
  
        // Validar que el usuario tenga la materia regularizada
        if(materia?.estado !== "REGULARIZADA") throw new GraphQLError('La materia no está regularizada por el usuario', {extensions: {code: 'CONFLICT'}})
  
        // Validar que la materia no esté vencida
        if(materia.vencimiento) {
          if(materia.vencimiento < new Date()) throw new GraphQLError('Materia vencida', {extensions: {code: 'CONFLICT'}}) 
        }
  
        // Validar que tenga llamados disponibles
        if(materia.llamadosUsados && materia.llamadosUsados >= 3) throw new GraphQLError('No quedan más llamados', {extensions: {code: 'CONFLICT'}}) 
  
        if(args.notaFinal >= 4) {
          // Si aprobo colocal materia aprobada
          materia.estado = "APROBADA"
          materia.notaFinal = args.notaFinal
        } else {
          // Si no aprobo suma llamado y fijarse si venció
          if(materia.llamadosUsados) {
            materia.llamadosUsados++
          } else {
            materia.llamadosUsados = 1
          }
        }
  
        return user.save()
      }
    },
    Materia: {
      comisionesActuales: async (root: IMateria) => {
        const anio = new Date().getFullYear()
        const cuatrimestre = new Date().getMonth() < 7 ? 1 : 2
        return await Comision.find({materiaId: root.id, anio, cuatrimestre})
      },
      comisionesAnteriores: async (root: IMateria) => {
        const cuatrimestreActual = new Date().getMonth() < 7 ? 1 : 2
        const anioActual = new Date().getFullYear()
        const anio = cuatrimestreActual === 2 ? anioActual : (anioActual - 1) 
        const cuatrimestre = cuatrimestreActual === 1 ? 2 : 1
        return await Comision.find({materiaId: root.id, anio, cuatrimestre})
      },
      profesores: async (root: IMateria) => {
        return await Profesor.find({materias: root.id})
      },
      planEstudio: async (root: IMateria) => {
        return await PlanEstudio.find({materiaId: root.id})
      },
      correlativas: async (root: IMateria) => {
        return await Materia.find({_id: root.correlativas}) 
      },
      cuatrimestreDictado: async (root: IMateria) => {
        const comisiones = await Comision.find({
          materiaId: root.id
        }).distinct('cuatrimestre')
        return comisiones
      }
    },
    PlanEstudioMateria: {
      carrera: async (root: IPlanEstudio) => {
        return await Carrera.findById(root.carreraId)
      }
    }
  }
}