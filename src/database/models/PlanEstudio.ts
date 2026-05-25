import mongoose, { Schema } from "mongoose"

const PlanEstudioSchema = new Schema({
    carreraId: {   
        type: Schema.ObjectId,
        ref: 'Carrera',
        required: true
    },
    materiaId: {    
        type: String,
        ref: 'Materia',
        required: true  
    },
    anio: {
        type: Number,   
        required: true
    },
    cuatrimestre: {
        type: String,   
        required: true
    }
})  

export const PlanEstudio = mongoose.model('PlanEstudio', PlanEstudioSchema, "planestudios")
