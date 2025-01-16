const db = require('../models');
const User = db.User;

const checkDuplicateEmail = async (req, res, next) => {
  console.log("Email recibido para verificación:", req.body.email); // Agregar log
  
  if (!req.body.email) {
    return res.status(400).send({ message: "El campo email es obligatorio." });
  }

  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });

    if (user) {
      return res.status(400).send({ message: 'El correo ya está en uso.' });
    }

    next();
  } catch (error) {
    console.error("Error al verificar el correo:", error.message);
    res.status(500).send({ message: 'Error al verificar el correo.', error });
  }
};


module.exports = { checkDuplicateEmail };
