import mongoose from "mongoose";

export const connect = async () => {
  const mongoUri = process.env.MONGO_URI
  if(!mongoUri) {
    throw new Error("Varibale de entorno de mongo uri no cargada")
  }
  await mongoose.connect(mongoUri)
  console.log('Conectado a la base de datos')
}