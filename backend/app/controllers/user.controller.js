//const {
//  users
//} = require('../models')
const db = require('../models');
console.log(db.users); // Esto debe ser el modelo User
const User = db.users;
const Bootcamp = db.bootcamps;
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");

// Registro
// Función de registro de usuario
exports.signup = async (req, res) => {
  console.log("User model:", User);

  try {
    console.log("Buscando usuario por correo: ", req.body.email);
    
    const existingUser = await User.findOne({
      where: { email: req.body.email }
    });
  
    if (existingUser) {
      console.log("Usuario ya existe: ", existingUser);
      return res.status(409).send("Usuario existente, inicie sesión en /login");
    }
  
    // Si el usuario no existe, crea uno nuevo
    const encryptedPassword = await bcrypt.hash(req.body.password, 10);
    
    const user = await User.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email.toLowerCase(),
      password: encryptedPassword,
    });
  
    console.log("Usuario creado: ", user);
    
    const token = jwt.sign(
      { user_id: user.id, email: user.email },
      process.env.TOKEN_KEY,
      { expiresIn: "1h" }
    );
  
    console.log("Token generado: " + token);
    return res.status(201).json({ user, token });
  
  } catch (err) {
    console.error("Error al registrar usuario: ", err);
    return res.status(500).send({
      message: "Error al verificar el correo.",
      error: err.message || err,
    });
  }
};

// Inicio de sesión
exports.signin = async (req, res) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email },
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    // Verificar si la contraseña es válida
    const isPasswordValid = bcrypt.compareSync(req.body.password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({
        message: "Contraseña incorrecta.",
        accessToken: null,
      });
    }

    // Generar token
    const token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400, // 24 horas
    });

    // Enviar respuesta con token y datos del usuario
    res.status(200).send({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      accessToken: token,
    });
  } catch (err) {
    res.status(500).send({ message: err.message });
  }
};

// Crear y guardar un nuevo usuario
exports.createUser = async (req, res) => {
  try {
    if (!req.body.firstName || !req.body.lastName || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message: "Todos los campos son obligatorios.",
      });
    }

    const user = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: bcrypt.hashSync(req.body.password, 8), // Contraseña encriptada
    };

    // Crear y guardar el usuario
    const data = await User.create(user);
    res.status(201).send({ message: "Usuario creado exitosamente.", data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al crear el usuario." });
  }
};

// Obtener los bootcamps de un usuario
exports.findUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const user = await User.findByPk(userId, {
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
      }]
    });

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    res.send(user);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al obtener el usuario." });
  }
};

// Obtener todos los usuarios incluyendo los bootcamps
exports.findAll = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{
        model: Bootcamp,
        as: "bootcamps",
        attributes: ["id", "title"],
        through: { attributes: [] },
      }]
    });

    res.send(users);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al obtener los usuarios." });
  }
};

// Actualizar un usuario por ID
exports.updateUserById = async (req, res) => {
  try {
    const { firstName, lastName } = req.body;
    const userId = req.params.id;

    if (!firstName || !lastName) {
      return res.status(400).send({ message: "Todos los campos son obligatorios." });
    }

    const [updated] = await User.update({ firstName, lastName }, { where: { id: userId } });

    if (updated === 0) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    res.send({ message: "Usuario actualizado exitosamente." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al actualizar el usuario." });
  }
};

// Eliminar un usuario por ID
exports.deleteUserById = async (req, res) => {
  try {
    const userId = req.params.id;

    const deleted = await User.destroy({ where: { id: userId } });

    if (deleted === 0) {
      return res.status(404).send({ message: "Usuario no encontrado." });
    }

    res.send({ message: "Usuario eliminado exitosamente." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al eliminar el usuario." });
  }
};
