import express from "express";
import multipart from 'connect-multiparty';

const router = express.Router();
const multipartMiddleware = multipart();
import {
  obtenerHabitaciones,
  obtenerHabitacion,
  nuevoHabitacion,
  editarHabitacion,
  eliminarHabitacion,
} from "../controllers/habitacionController.js";
import checkAuth from "../middleware/checkAuth.js";

router
  .route("/")
  .get(checkAuth, obtenerHabitaciones)
  .post( multipartMiddleware,checkAuth, nuevoHabitacion);
router
  .route("/:id")
  .get(checkAuth, obtenerHabitacion)
  .put(multipartMiddleware,checkAuth, editarHabitacion)
  .delete(checkAuth, eliminarHabitacion);

export default router;
