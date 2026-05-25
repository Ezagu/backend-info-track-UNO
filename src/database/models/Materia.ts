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
    promocion: {
        type: Boolean,
        default: false
    },
    correlativas: [{
        type: String,
        ref: 'Materia'
    }],
    cargaHorariaSemanal: Number,
    cargaHorariaTotal: Number,
    linkCampus: String,
    linkWhatsapp: String
});

export const Materia = mongoose.model('Materia', MateriaSchema, 'materias');
