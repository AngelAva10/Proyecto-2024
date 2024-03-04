import { borrarImagen, subirIconoHabitacion } from "../helpers/imagenes.js";
import Habitacion from "../models/Habitacion.js";
import Tarea from "../models/Tarea.js"
import Usuario from "../models/Usuario.js";

const obtenerHabitaciones = async (req, res) => {
  const habitaciones = await Habitacion.find()
    .where("creador")
    .equals(req.usuario)
    .select("-tareas");
  res.json(habitaciones);
};

const nuevoHabitacion = async (req, res) => {
  const userId = req.usuario._id;
  const usuario = await Usuario.findById({_id:userId})
  const habitaciones = await Habitacion.find({creador: userId})
  if(usuario.premium === false && habitaciones.length === 5){
    return res.json({msg: "No puedes crear mas de 5 habitaciones"});
  }

  const {nombre,descripcion,fechaEntrega,cliente} = req.body;
  const {icono} = req.files;

  const habitacion = await new Habitacion({nombre , descripcion , fechaEntrega , cliente});
  habitacion.creador = req.usuario._id;
  if(habitacion && icono){
    const url = await subirIconoHabitacion(icono.path);
    habitacion.icono = await url;
  }
  try {
    const habitacionAlmacenado = await habitacion.save();
    res.json(habitacionAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const obtenerHabitacion = async (req, res) => {
  const { id } = req.params;
  const habitacion = await Habitacion.findById(id).populate("tareas");

  if (!habitacion) {
    const error = new Error("Habitacion no encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (habitacion.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Accion no valida");
    return res.status(404).json({ msg: error.message });
  }
  return res.json(habitacion);
};

const editarHabitacion = async (req, res) => {
  const { id } = req.params;
  const {icono} = req.files;

  const habitacion = await Habitacion.findById(id);

  if (!habitacion) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (habitacion.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  if(habitacion.icono && icono){
    await borrarImagen(habitacion.icono)
  }
  if(icono){
    const url = await subirIconoHabitacion(icono.path)
    habitacion.icono = url || habitacion.icono;
  }
  habitacion.nombre = req.body.nombre || habitacion.nombre;
  habitacion.descripcion = req.body.descripcion || habitacion.descripcion;
  habitacion.fechaEntrega = req.body.fechaEntrega || habitacion.fechaEntrega;
  habitacion.cliente = req.body.cliente || habitacion.cliente;

  try {
    const habitacionAlmacenado = await habitacion.save();
    res.json(habitacionAlmacenado);
  } catch (error) {
    console.log(error);
  }
};

const eliminarHabitacion = async (req, res) => {
  const { id } = req.params;

  const habitacion = await Habitacion.findById(id);

  if (!habitacion) {
    const error = new Error("No Encontrado");
    return res.status(404).json({ msg: error.message });
  }

  if (habitacion.creador.toString() !== req.usuario._id.toString()) {
    const error = new Error("Acción No Válida");
    return res.status(401).json({ msg: error.message });
  }

  try {
    await Tarea.deleteMany({habitacion: habitacion._id});
    await habitacion.deleteOne();
    await borrarImagen(habitacion.icono)
    res.json({ msg: "Habitacion Eliminado" });
  } catch (error) {
    console.log(error);
  }
};

export {
  obtenerHabitaciones,
  obtenerHabitacion,
  nuevoHabitacion,
  editarHabitacion,
  eliminarHabitacion,
};
