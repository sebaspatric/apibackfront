// middleware/auth.js
const jwt = require("jsonwebtoken");
const config = require("../config/auth.config");  // Cargar la configuración

const verifyToken = (req, res, next) => {
  let token = req.body.token || req.query.token || req.headers["authorization"];

  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length); // Remover "Bearer "
  }
  // Log para depurar el token recibido
  console.log("Token recibido:", token);

  if (!token) {
    return res.status(403).send({ message: "Un token es requerido para la autorización" });
  }

  try {
    // Verificar y decodificar el token usando la clave secreta
    const decoded = jwt.verify(token, config.secret);

    // Guardar los datos del usuario decodificados en la solicitud
    req.user = decoded;

    next(); // Continuar con la solicitud
  } catch (err) {
    console.error("Error al verificar el token:", err.message);
    return res.status(401).send({ message: "Token no válido, acceso denegado" });
  }
};

module.exports = { verifyToken }; // Asegúrate de exportarlo como un objeto