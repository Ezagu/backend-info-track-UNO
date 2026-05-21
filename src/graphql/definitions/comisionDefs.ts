export const comisionDefs = () => {
  return `
    enum SalonType {
      AULA
      LABORATORIO
    }

    enum Modalidad {
      VIRTUAL
      PRESENCIAL
      SEMIPRESENCIAL
    }

    enum Dia {
      LUNES
      MARTES
      MIERCOLES
      JUEVES
      VIERNES
      SABADO
    }

    type Salon {
      numero: Int!
      tipo: SalonType!
    }

    type Horario {
      dia: Dia
      horaInicio: String
      horaFin: String
    }

    type Comision {
        id: ID!
        materia: Materia!
        numero: Int!
        horarios: [Horario]!
        salon: Salon
        anio: Int!
        cuatrimestre: Int!
        modalidad: Modalidad!
    }
  `     
}   