import mongoose from "mongoose";

const habitacionesSchema = mongoose.Schema(
  {
    icono:{
      type: String,
      trim: true,
      require: true,
      default: ''
    },
    nombre: {
      type: String,
      trim: true,
      required: true,
    },
    descripcion: {
      type: String,
      trim: true,
      required: true,
    },
    fechaEntrega: {
      type: Date,
      default: Date.now(),
    },
    cliente: {
      type: String,
      trim: true,
      required: true,
    },
    creador: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
    },
    tareas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tarea",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Habitacion = mongoose.model("Habitacion", habitacionesSchema);

export default Habitacion;
