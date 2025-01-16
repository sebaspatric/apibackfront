const express = require('express');
const router = express.Router();
const { createBootcamp, addUser, findById, findAll } = require('../controllers/bootcamp.controller');
const { verifyToken } = require("../middleware/auth");
const { deleteBootcamp } = require("../controllers/bootcamp.controller");
const { updateBootcamp } = require("../controllers/bootcamp.controller");

router.post('/bootcamp', [verifyToken], createBootcamp);  // Crear bootcamp
router.post('/bootcamp/adduser', [verifyToken], addUser);  // Añadir usuario a bootcamp
router.get('/bootcamp/:id', [verifyToken], findById);  // Obtener bootcamp por ID
router.get('/bootcamp', findAll);  // Obtener todos los bootcamps
router.delete('/bootcamp/:id', [verifyToken], deleteBootcamp);  // Obtener bootcamp por ID
router.put('/bootcamp/:id', [verifyToken], updateBootcamp);  // Obtener bootcamp por ID

module.exports = router;
