// app/routes/user.routes.js

const express = require("express");
const router = express.Router();
const {
  signup,
  signin,
  findUserById,
  findAll,
  updateUserById,
  deleteUserById,
} = require("../controllers/user.controller"); // Asegúrate de que la ruta del archivo sea correcta
console.log({ signup, signin, findUserById, findAll, updateUserById, deleteUserById });

const { verifyToken } = require("../middleware/auth"); // Middleware de autenticación
const { checkDuplicateEmail } = require("../middleware/verifySignUp"); // Middleware de validación de email

// Definición de rutas
router.post("/signup", [checkDuplicateEmail], signup); // Registro de usuario
router.post("/signin", signin); // Inicio de sesión

router.get("/user/:id", [verifyToken], findUserById); // Obtener usuario por ID
router.get("/user", [verifyToken], findAll); // Obtener todos los usuarios

router.put("/user/:id", [verifyToken], updateUserById); // Actualizar usuario
router.delete("/user/:id", [verifyToken], deleteUserById); // Eliminar usuario

module.exports = router;
