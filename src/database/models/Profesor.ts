import mongoose, { Schema } from "mongoose"

const PuntuacionSchema = new Schema({
    usuarioId: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    },
    puntuacion: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comentario: String,
    fecha: {
        type: Date,
        default: Date.now
    }
})

const ProfesorSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    nombreNormalizado: {
        type: String, 
        required: true
    },
    email: {
        type: String,
        required: true, 
        unique: true
    },
    puntuaciones: [PuntuacionSchema],
    materias: [{
        type: String,
        ref: 'Materia'
    }]
})

export const Profesor = mongoose.model('Profesor', ProfesorSchema, 'profesores')
