const {
  users,
  bootcamps
} = require('../models')
const db = require('../models');
const Bootcamp = db.bootcamps;
const User = db.users;

// Crear y guardar un nuevo bootcamp
exports.createBootcamp = async (req, res) => {
  try {
    // Verificar que los campos obligatorios estén presentes
    if (!req.body.title || !req.body.description || !req.body.cue) {
      return res.status(400).send({
        message: "Todos los campos son obligatorios.",
      });
    }

    // Crear el bootcamp
    const bootcamp = {
      title: req.body.title,
      description: req.body.description,
      cue: req.body.cue,
    };

    // Guardar el bootcamp en la base de datos
    const data = await Bootcamp.create(bootcamp);
    res.status(201).send({ message: "Bootcamp creado exitosamente.", data });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al crear el bootcamp." });
  }
};

// Agregar un usuario al bootcamp
exports.addUser = async (req, res) => {
  try {
    const { bootcampId, userEmails } = req.body; // Recibimos bootcampId y userEmails

    // Buscar el bootcamp
    const bootcamp = await Bootcamp.findByPk(bootcampId);
    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    // Buscar los usuarios por sus correos electrónicos
    const users = await User.findAll({
      where: {
        email: userEmails, // Filtramos por los correos proporcionados
      }
    });

    // Verificar que todos los usuarios existan
    if (users.length !== userEmails.length) {
      return res.status(404).send({ message: "Uno o más usuarios no fueron encontrados." });
    }

    // Agregar los usuarios al bootcamp (relación many-to-many)
    await bootcamp.addUsers(users); // Usamos addUsers para agregar varios usuarios

    res.send({ message: "Usuarios agregados al bootcamp exitosamente." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al agregar los usuarios al bootcamp." });
  }
};


// Obtener un bootcamp por ID
exports.findById = async (req, res) => {
  try {
    const bootcampId = req.params.id;

    // Buscar el bootcamp por ID
    const bootcamp = await Bootcamp.findByPk(bootcampId, {
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName", "email"],
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
      }]
    });

    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    res.send(bootcamp);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al obtener el bootcamp." });
  }
};

// Obtener todos los bootcamps
exports.findAll = async (req, res) => {
  try {
    const bootcamps = await Bootcamp.findAll({
      include: [{
        model: User,
        as: "users",
        attributes: ["id", "firstName", "lastName", "email"],
        through: { attributes: [] }, // No incluir atributos de la tabla intermedia
      }]
    });

    res.send(bootcamps);
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al obtener los bootcamps." });
  }
};

// Eliminar un bootcamp por ID
exports.deleteBootcamp = async (req, res) => {
  try {
    const bootcampId = req.params.id;

    // Buscar el bootcamp por ID
    const bootcamp = await Bootcamp.findByPk(bootcampId);

    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    // Eliminar el bootcamp
    await bootcamp.destroy();

    res.send({ message: "Bootcamp eliminado exitosamente." });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al eliminar el bootcamp." });
  }
};

// Actualizar un bootcamp por ID
exports.updateBootcamp = async (req, res) => {
  try {
    const bootcampId = req.params.id;

    // Buscar el bootcamp por ID
    const bootcamp = await Bootcamp.findByPk(bootcampId);

    if (!bootcamp) {
      return res.status(404).send({ message: "Bootcamp no encontrado." });
    }

    // Actualizar el bootcamp con los nuevos datos
    const { title, description, cue } = req.body;

    // Si algún campo no se ha proporcionado, no lo actualizamos
    if (title) bootcamp.title = title;
    if (description) bootcamp.description = description;
    if (cue) bootcamp.cue = cue;

    // Guardar los cambios
    await bootcamp.save();

    res.send({ message: "Bootcamp actualizado exitosamente.", bootcamp });
  } catch (err) {
    res.status(500).send({ message: err.message || "Error al actualizar el bootcamp." });
  }
};
