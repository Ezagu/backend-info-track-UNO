import mongoose, { Schema } from "mongoose"

const MateriaUsuarioSchema = new Schema({
  materiaId: {
    type: String,
    ref: 'Materia',
    required: true
  },
  estado: {
    type: String,
    enum: ["PROMOCIONADA", "APROBADA", "REGULARIZADA", "CURSANDO"],
    required: true
  },
  anio: Number,
  cuatrimestre: Number,
  llamadosUsados: Number,
  vencimiento: Date,
  notaFinal: Number
})

const UsuarioSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  apellido: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    default: "USER",
    enum: ["USER", "ADMIN"]
  },
  anioIngreso: Number,
  materias: [MateriaUsuarioSchema],
  carreras: [{
      type: Schema.ObjectId,
      ref: 'Carrera'
  }]
})

export const User = mongoose.model('Usuario', UsuarioSchema, 'usuarios')