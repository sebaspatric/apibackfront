const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require('./app/models');
require('dotenv').config(); // Cargar las variables de entorno

// Importar rutas
const userRoutes = require("./app/routes/user.routes");
const bootcampRoutes = require("./app/routes/bootcamp.routes");
const userController = require('./app/controllers/user.controller')
const bootcampController = require('./app/controllers/bootcamp.controller')

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use("/api", userRoutes);  // Rutas de usuarios (ruta más específica)
app.use("/api", bootcampRoutes);  // Rutas de bootcamps (ruta más específica)

// Configuración de puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

db.sequelize.authenticate()
  .then(() => {
    console.log("Conexión a la base de datos establecida.");
  })
  .catch((err) => {
    console.error("Error en la conexión a la base de datos:", err);
  });



  db.sequelize.sync({
    force: true
  }).then(() => {
    console.log('Eliminando y resincronizando la base de datos.')
    //run()
  })
  

//  -- Otorga todos los privilegios sobre el esquema 'public' al usuario 'node_user'
//GRANT ALL PRIVILEGES ON SCHEMA public TO node_user;

//-- Permitir que 'node_user' cree tablas de manera predeterminada en el esquema 'public'
//ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO node_user;

//-- Asegúrate de que el propietario de la base de datos sea 'node_user' (si aplica)
//ALTER DATABASE db_jwtbootcamp2 OWNER TO node_user;
