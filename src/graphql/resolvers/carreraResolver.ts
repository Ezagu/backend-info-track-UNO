import { GraphQLError } from "graphql"
import { Carrera }  from "../../database/models/Carrera.js"
import { PlanEstudio } from "../../database/models/PlanEstudio.js"
import type { Context } from "../../types/auth.js"
import type { ICarrera } from "../../types/carrera.js"

export const carreraResolver = () => {
  return {
    Query: {
      carreras: async () => { 
        const carreras = await Carrera.find()
        console.log(carreras)
        return carreras
      },
      carrera: async (_root: undefined, args: {id: string}) => {
        return await Carrera.findById(args.id)
      },
      estadisticasPorCarrera: async (_root: undefined, _args: undefined, {currentUser}: Context) => {
        // Verificamos que este logueado
        if(!currentUser) throw new GraphQLError('Usuario no identificado', {extensions: {code: "UNAUTHORIZED"}})

        const carreras = await Carrera.find({_id: currentUser.carreras});

        return Promise.all(
          carreras.map(async (carrera) => {
            const todasLasMaterias = await PlanEstudio.find({carreraId: carrera.id}).select('materiaId')
            const idsMaterias = todasLasMaterias.map(materia => materia.materiaId)

            const materiasUsuario = currentUser.materias.filter(m => 
              idsMaterias.includes(m.materiaId)
            )

            const materiasAprobadas = materiasUsuario.filter(m => m.estado === "APROBADA")
            const materiasPromocionadas = materiasUsuario.filter(m => m.estado === "PROMOCIONADA")
            const materiasRegularizadas = materiasUsuario.filter(m => m.estado === "REGULARIZADA")
            const materiasCursando = materiasUsuario.filter(m => m.estado === "CURSANDO")

            const idsConEstado = materiasUsuario.map(m => m.materiaId);
            const materiasFaltantes = todasLasMaterias.filter(m => !idsConEstado.includes(m.materiaId));

            // Promedio solo de aprobadas + promocionadas
            const conNota = [...materiasAprobadas, ...materiasPromocionadas].filter(m => m.notaFinal != null);
            const promedio = conNota.length > 0
              ? conNota.reduce((acc, m) => acc + m.notaFinal!, 0) / conNota.length
              : null;

            return {
              carrera,
              aprobadas: materiasAprobadas.length,
              promocionadas: materiasPromocionadas.length,
              regularizadas: materiasRegularizadas.length,
              cursando: materiasCursando.length,
              faltantes: materiasFaltantes.length,
              porcentajeCompletado: ((materiasAprobadas.length + materiasPromocionadas.length) / todasLasMaterias.length) * 100,
              promedio,
              materiasAprobadas,
              materiasPromocionadas,
              materiasRegularizadas,
              materiasCursando,
              materiasFaltantes
            }
          })
        )
      }
    },
    Carrera: {
      materias: async (root: ICarrera) => {
          const planEstudio = await PlanEstudio.find({carreraId: root._id}).populate('materiaId')
          return planEstudio.map(plan => ({
              materia: plan.materiaId,
              anio: plan.anio,
              cuatrimestre: plan.cuatrimestre,
          }))
      },
      cantidadMaterias: async(root: ICarrera) => {
          return await PlanEstudio.countDocuments({carreraId: root._id})
      }
    }
  }
}   