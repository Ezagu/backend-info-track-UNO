import mongoose, { Schema } from 'mongoose';

const ComisionSchema = new Schema({
    materiaId: {
        type: Schema.ObjectId,
        ref: 'Materia',
        required: true
    },
    numero: {
        type: Number,
        required: true
    },
    horarios: [
        {
            dia: {
                type: String,
                enum: ["LUNES", "MARTES", "MIERCOLES", "JUEVES", "VIERNES", "SABADO"]
            },
            horaInicio: String,
            horaFin: String
        }
    ],
    salon: {
        numero: Number,
        tipo: {
            type: String,
            enum: ["LABORATORIO", "AULA"]
        }
    },
    anio: {
        type: Number,
        required: true
    },
    cuatrimestre: {
        type: Number,
        required: true
    },
    modalidad: {
        type: String,
        enum: ["VIRTUAL", "PRESENCIAL", "SEMIPRESENCIAL"],
        default: "PRESENCIAL"
    }
}); 

export const Comision = mongoose.model('Comision', ComisionSchema);
