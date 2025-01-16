# Gestión de Usuarios y Bootcamps

Este proyecto es una aplicación para la gestión de usuarios y bootcamps, utilizando un backend con Node.js, Express, Sequelize (para manejar la base de datos), y un frontend con HTML, CSS y JavaScript.

## Descripción

La aplicación permite a los administradores gestionar usuarios, bootcamps y asignar usuarios a bootcamps. Además, proporciona funcionalidad para el login y registro de usuarios, la edición de información de usuarios y bootcamps, y la búsqueda de usuarios y bootcamps por ID.

## Tecnologías

- **Backend**:
  - Node.js
  - Express.js
  - Sequelize
  - JWT para autenticación
  - PostgreSQL (Base de datos)
  
- **Frontend**:
  - HTML
  - CSS
  - JavaScript (Vanilla)
  - Bootstrap

## Instalación

### Backend

1. **Clonar el repositorio**:
   ```bash
   git clone https://github.com/tu-usuario/gestion-usuarios-bootcamps.git
   cd gestion-usuarios-bootcamps

2. **Instalar las dependencias:**:

   ```
   npm install
   ```
3. **Ejecutar el servidor:**:
    ```
    npm start
   ```

## Rutas del Backend

### **Autenticación de Usuario**

- **POST** `/login`: Autenticación de usuario.
    - **Descripción**: Autentica a un usuario y devuelve un token JWT para acceso posterior.
    - **Body**:
      ```json
      {
        "email": "usuario@dominio.com",
        "password": "contraseña"
      }
      ```
    - **Respuesta**:
      ```json
      {
        "success": true,
        "token": "jwt_token"
      }
      ```
    - **Código de estado**:
      - `200 OK`: Autenticación exitosa.
      - `400 Bad Request`: Datos incorrectos o incompletos.
      - `401 Unauthorized`: Credenciales incorrectas.

- **POST** `/register`: Registro de un nuevo usuario.
    - **Descripción**: Crea un nuevo usuario en la base de datos.
    - **Body**:
      ```json
      {
        "firstName": "Nombre",
        "lastName": "Apellido",
        "email": "usuario@dominio.com",
        "password": "contraseña"
      }
      ```
    - **Respuesta**:
      ```json
      {
        "success": true,
        "message": "Usuario registrado con éxito"
      }
      ```
    - **Código de estado**:
      - `201 Created`: Usuario creado exitosamente.
      - `400 Bad Request`: Datos incorrectos o incompletos.

### **Usuarios**

- **GET** `/usuarios`: Obtener todos los usuarios.
    - **Descripción**: Devuelve una lista de todos los usuarios registrados.
    - **Respuesta**:
      ```json
      [
        {
          "id": 1,
          "firstName": "Juan",
          "lastName": "Pérez",
          "email": "juan@dominio.com"
        },
        ...
      ]
      ```
    - **Código de estado**:
      - `200 OK`: Usuarios obtenidos exitosamente.
      - `500 Internal Server Error`: Error en el servidor.

- **GET** `/usuarios/:id`: Buscar un usuario por su ID.
    - **Descripción**: Devuelve los detalles de un usuario específico por su ID.
    - **Parámetros**: `id` (ID del usuario)
    - **Respuesta**:
      ```json
      {
        "id": 1,
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@dominio.com"
      }
      ```
    - **Código de estado**:
      - `200 OK`: Usuario encontrado.
      - `404 Not Found`: Usuario no encontrado.

- **PUT** `/usuarios/:id`: Editar un usuario.
    - **Descripción**: Permite editar la información de un usuario específico.
    - **Parámetros**: `id` (ID del usuario)
    - **Body**:
      ```json
      {
        "firstName": "Juan",
        "lastName": "Pérez",
        "email": "juan@dominio.com"
      }
      ```
    - **Respuesta**:
      ```json
      {
        "success": true,
        "message": "Usuario actualizado con éxito"
      }
      ```
    - **Código de estado**:
      - `200 OK`: Usuario actualizado con éxito.
      - `404 Not Found`: Usuario no encontrado.

### **Bootcamps**

- **GET** `/bootcamps`: Obtener todos los bootcamps.
    - **Descripción**: Devuelve una lista de todos los bootcamps registrados.
    - **Respuesta**:
      ```json
      [
        {
          "id": 1,
          "title": "Bootcamp de Node.js",
          "cue": "123456",
          "description": "Aprende a desarrollar aplicaciones con Node.js"
        },
        ...
      ]
      ```
    - **Código de estado**:
      - `200 OK`: Bootcamps obtenidos exitosamente.
      - `500 Internal Server Error`: Error en el servidor.

- **GET** `/bootcamps/:id`: Buscar un bootcamp por su ID.
    - **Descripción**: Devuelve los detalles de un bootcam

## Rutas del Frontend

El frontend de la aplicación está estructurado con las siguientes rutas. Cada ruta corresponde a una página o componente específico en la interfaz de usuario:

### Rutas Principales

- **`/index.html`**:
  - Página principal donde los usuarios pueden ver la interfaz de la aplicación.
  - Aquí se presenta un resumen de la funcionalidad del sistema, como la gestión de usuarios y bootcamps.



### Rutas para Operaciones

Las siguientes rutas están relacionadas con las operaciones que los usuarios pueden realizar en la interfaz:

- **`/users/:id`**:
  - Muestra los detalles de un usuario específico basado en su ID.
  - Los administradores pueden editar o eliminar este usuario a través de esta página.

- **`/bootcamps/:id`**:
  - Muestra los detalles de un bootcamp específico.
  - Los administradores pueden modificar la información del bootcamp o agregar usuarios a él.

### Rutas Condicionales

Algunas páginas tienen rutas condicionales que dependen del estado de autenticación:

- Si el usuario no está autenticado, se le redirige automáticamente a la página de inicio de sesión (`login.html`).
- Si el usuario intenta acceder a una página protegida sin estar autenticado, se le redirige a `login.html`.

Estas rutas permiten la interacción con el backend para gestionar usuarios y bootcamps, haciendo uso de solicitudes HTTP como `GET`, `POST`, `PUT` y `DELETE`.

Asegúrate de que el servidor backend esté corriendo para que estas rutas funcionen correctamente y el frontend se comunique con el backend de manera efectiva.


