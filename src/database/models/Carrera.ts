import mongoose, { Schema } from "mongoose"

const CarreraSchema = new Schema({
    nombre: {
        type: String,
        required: true
    },
    duracion: {
        type: Number,
        required: true
    },
    abreviacion: {
        type: String,
        required: true
    }
    ,
    descripcion: {
        type: String,
        required: true
    },
    tituloOtorgado: {
        type: String,
        required: true
    },
    cargaHorariaTotal: {
        type: Number, 
        required: true
    }
})

export const Carrera = mongoose.model('Carrera', CarreraSchema, 'carreras')