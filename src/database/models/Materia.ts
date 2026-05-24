import mongoose, { Schema } from 'mongoose';

const MateriaSchema = new Schema({
    _id: String,
    nombre: {
        type: String,
        required: true
    },
    nombreNormalizado: {
        type: String,
        required: true
    },
    electiva: { 
        type: Boolean,
        default: false
    },
    promocion: {
        type: Boolean,
        default: false
    },
    cargaHorariaSemanal: Number,
    cargaHorariaTotal: Number,
    linkCampus: String,
    linkWhatsapp: String
});

export const Materia = mongoose.model('Materia', MateriaSchema, 'materias');
