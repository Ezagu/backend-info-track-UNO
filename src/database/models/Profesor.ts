import mongoose, { Schema } from "mongoose"

const RatingSchema = new Schema({
    usuarioId: {
        type: Schema.ObjectId,
        ref: 'Usuario'
    },
    rate: {
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
    email: {
        type: String,
        required: true, 
        unique: true
    },
    ratings: [RatingSchema],
    linkCampus: {  
        type: String,
        required: true
    },
    materias: [{
        type: String,
        ref: 'Materia'
    }]
})

export const Profesor = mongoose.model('Profesor', ProfesorSchema, 'profesores')
