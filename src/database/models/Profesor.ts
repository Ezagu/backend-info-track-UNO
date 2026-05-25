import mongoose, { Schema } from "mongoose"

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
    materias: [{
        type: String,
        ref: 'Materia'
    }]
})

export const Profesor = mongoose.model('Profesor', ProfesorSchema, 'profesores')
