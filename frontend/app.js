// URL base para los endpoints
const baseUrl = "http://localhost:5001/api";

// Función de Login
// Función de Registro de Usuario
// Función de Registro de Usuario
// Función de Registro de Usuario
// Función de Registro de Usuario
async function signUp() {
    const firstName = document.getElementById("signup-firstname").value;
    const lastName = document.getElementById("signup-lastname").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    const signUpData = { firstName, lastName, email, password };

    try {
        const response = await fetch(`${baseUrl}/signup`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(signUpData)
        });

        // Si la respuesta no es correcta, mostrar el error
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error del servidor:", errorText);
            alert("Error al crear usuario: " + errorText);
            return;
        }

        // Obtener los datos de la respuesta
        const data = await response.json();

        // Verificar que la respuesta contiene un usuario
        if (data.user) {
            alert("Usuario creado exitosamente. Bienvenido, " + data.user.firstName);
            
            // Guardar el token si es necesario para futuras solicitudes
            localStorage.setItem("authToken", data.token);

            showLoginForm(); // Mostrar formulario de login
        } else {
            alert("Error al crear usuario: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error durante el registro:", error);
        alert("Error en el servidor o red.");
    }
}



// Función de inicio de sesión
// Función de Login
async function login() {
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    const loginData = { email, password };

    try {
        const response = await fetch(`${baseUrl}/signin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(loginData)
        });

        // Si la respuesta no es correcta, mostrar el error
        if (!response.ok) {
            const errorText = await response.text();
            console.error("Error del servidor:", errorText);
            alert("Error al iniciar sesión: " + errorText);
            return;
        }

        // Obtener los datos de la respuesta
        const data = await response.json();

        // Verificar que la respuesta contiene un accessToken
        if (data.accessToken) {
            alert("Inicio de sesión exitoso. Bienvenido, " + data.firstName);
            
            // Guardar el accessToken si es necesario para futuras solicitudes
            localStorage.setItem("authToken", data.accessToken);

            // Redirigir o mostrar contenido protegido
            //showUserDashboard(); // Mostrar la página o panel de usuario
        } else {
            alert("Error al iniciar sesión: " + JSON.stringify(data));
        }
    } catch (error) {
        console.error("Error durante el inicio de sesión:", error);
        alert("Error en el servidor o red.");
    }
}
// Función para obtener la lista de usuarios
async function obtenerUsuarios() {
    try {
      // Recuperar el token de localStorage
      const token = localStorage.getItem("authToken");
  
      // Si no se tiene el token, mostrar un mensaje y salir
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
  
      // Realizamos la solicitud usando el token
      const response = await fetch(`${baseUrl}/user`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`, // Pasamos el token en los encabezados
        },
      });
  
      // Verificamos si la respuesta fue exitosa
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API');
      }
  
      // Parseamos la respuesta como JSON
      const usuarios = await response.json();
      
      // Limpiamos la lista anterior (si hay)
      const listaUsuarios = document.getElementById('listaUsuarios');
      listaUsuarios.innerHTML = '';
  
      // Mostramos la lista de usuarios en la consola
      console.log('Usuarios:', usuarios);
  
      // Añadimos los usuarios a la lista en la interfaz
      usuarios.forEach(usuario => {
        const userItem = document.createElement('li');
        userItem.textContent = `Nombre: ${usuario.firstName} ${usuario.lastName}, Email: ${usuario.email}`;
        
        // Botón de Editar
        const editButton = document.createElement('button');
        editButton.textContent = 'Editar';
        editButton.addEventListener('click', () => editarUsuario(usuario));

        // Botón de Eliminar
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => eliminarUsuario(usuario.id));

        // creamos un sublistado para los bootcamps
        const bootcampList = document.createElement('ul');
        if (usuario.bootcamps && usuario.bootcamps.length > 0) {
            usuario.bootcamps.forEach(bootcamp => {
              console.log('Bootcamp:', bootcamp); // Verificar cada bootcamp
              const bootcampItem = document.createElement('li');
              bootcampItem.textContent = `Bootcamp: ${bootcamp.title}`;
              bootcampList.appendChild(bootcampItem);
            });
        } else {
            const noBootcampItem = document.createElement('li');
            noBootcampItem.textContent = 'No tiene bootcamps';
            bootcampList.appendChild(noBootcampItem);
        }

        // Añadimos los botones y la lista de bootcamps debajo del nombre del usuario
        userItem.appendChild(bootcampList);
        userItem.appendChild(editButton);
        userItem.appendChild(deleteButton);

        listaUsuarios.appendChild(userItem);
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
}

// Función para editar usuario
function editarUsuario(usuario) {
    // Llenamos los campos del formulario con los datos del usuario
    document.getElementById('editFirstName').value = usuario.firstName;
    document.getElementById('editLastName').value = usuario.lastName;
    document.getElementById('editEmail').value = usuario.email;

    // Mostramos el modal
    const modal = document.getElementById('modalEditarUsuario');
    modal.style.display = "block";

    // Guardamos el ID del usuario para usarlo en la actualización
    document.getElementById('formEditarUsuario').onsubmit = async function (e) {
        e.preventDefault();

        // Actualizamos el usuario
        const updatedUser = {
            firstName: document.getElementById('editFirstName').value,
            lastName: document.getElementById('editLastName').value,
            email: document.getElementById('editEmail').value,
        };

        try {
            // Realizamos la solicitud para actualizar el usuario
            const token = localStorage.getItem("authToken");
            const response = await fetch(`${baseUrl}/user/${usuario.id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                throw new Error('Error al actualizar el usuario');
            }

            // Si todo sale bien, cerramos el modal y recargamos los usuarios
            alert('Usuario actualizado correctamente');
            document.getElementById('modalEditarUsuario').style.display = 'none';
            obtenerUsuarios(); // Recargamos la lista de usuarios
        } catch (error) {
            console.error('Error al actualizar el usuario:', error);
            alert('Hubo un error al actualizar el usuario');
        }
    };

    // Función para cerrar el modal
    document.getElementById('cerrarModal').onclick = function () {
        document.getElementById('modalEditarUsuario').style.display = "none";
    };

    // Cancelar la edición
    document.getElementById('cancelarEdicion').onclick = function () {
        document.getElementById('modalEditarUsuario').style.display = "none";
    };
}


// Función para eliminar usuario
async function eliminarUsuario(userId) {
    try {
        // Recuperar el token de localStorage
        const token = localStorage.getItem("authToken");
  
        // Si no se tiene el token, mostrar un mensaje y salir
        if (!token) {
            console.error('No se encontró el token de autenticación');
            return;
        }

        // Realizamos la solicitud para eliminar al usuario
        const response = await fetch(`${baseUrl}/user/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`, // Pasamos el token en los encabezados
            },
        });

        // Verificamos si la respuesta fue exitosa
        if (!response.ok) {
            throw new Error('Error al eliminar el usuario');
        }

        // El usuario fue eliminado con éxito, recargamos la lista
        alert('Usuario eliminado');
        obtenerUsuarios();
    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
    }
}
  

// Mostrar formulario de registro
function showSignUpForm() {
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "block";
}

// Mostrar formulario de login
function showLoginForm() {
    document.getElementById("signup-form").style.display = "none";
    document.getElementById("login-form").style.display = "block";
}

// Validar que los formularios estén correctamente definidos y mostrar los resultados:
document.getElementById("show-signup-btn").addEventListener("click", showSignUpForm); // Al hacer clic en el botón de mostrar registro
document.getElementById("show-login-btn").addEventListener("click", showLoginForm); // Al hacer clic en el botón de mostrar login




  
  // Llamar a la función cuando el usuario haga clic

  async function obtenerBootcampsConUsuarios() {
    try {
      // Recuperar el token de localStorage
      const token = localStorage.getItem("authToken");
  
      // Si no se tiene el token, mostrar un mensaje y salir
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
  
      // Realizamos la solicitud usando el token para obtener los bootcamps
      const responseBootcamps = await fetch('http://localhost:5001/api/bootcamp', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!responseBootcamps.ok) {
        throw new Error('Error en la respuesta de la API de bootcamps');
      }
  
      // Parseamos la respuesta de bootcamps como JSON
      const bootcamps = await responseBootcamps.json();
  
      // Limpiamos la lista anterior (si hay)
      const listaBootcamps = document.getElementById('listaBootcamps');
      listaBootcamps.innerHTML = '';
  
      // Mostramos la lista de bootcamps en la consola
      console.log('Bootcamps:', bootcamps);
  
      // Añadimos los bootcamps a la lista en la interfaz
      bootcamps.forEach(bootcamp => {
        const bootcampItem = document.createElement('li');
        bootcampItem.textContent = `Bootcamp: ${bootcamp.title} - ${bootcamp.description}`;
  
        // Botón para ver los detalles del bootcamp
        const detallesButton = document.createElement('button');
        detallesButton.textContent = 'Detalles';
        detallesButton.addEventListener('click', () => obtenerDetallesBootcamp(bootcamp.id));  // Llamar a la función obtenerDetallesBootcamp con el ID del bootcamp

        // Botón para abrir el modal de agregar usuarios
        const agregarButton = document.createElement('button');
        agregarButton.textContent = 'Agregar Usuarios';
        agregarButton.addEventListener('click', () => mostrarModalAddUser(bootcamp.id));
  
        // Crear un sublistado para los usuarios de este bootcamp
        const userList = document.createElement('ul');
        if (bootcamp.users && bootcamp.users.length > 0) {
          bootcamp.users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.textContent = `Nombre: ${user.firstName} ${user.lastName}`;
            
            // Botón de Editar
            const editButton = document.createElement('button');
            editButton.textContent = 'Editar Usuario';
            editButton.addEventListener('click', () => editarUsuario(user));
  
            // Botón de Eliminar
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Eliminar Usuario';
            deleteButton.addEventListener('click', () => eliminarUsuario(user.id));
  
            // Añadimos los botones al item del usuario
            userItem.appendChild(editButton);
            userItem.appendChild(deleteButton);
  
            userList.appendChild(userItem);
          });
        } else {
          const noUserItem = document.createElement('li');
          noUserItem.textContent = 'No hay usuarios asignados';
          userList.appendChild(noUserItem);
        }
  
        // Añadimos la lista de usuarios debajo del bootcamp
        bootcampItem.appendChild(userList);
        bootcampItem.appendChild(agregarButton);
        bootcampItem.appendChild(detallesButton); // Añadir el botón "Detalles"
        listaBootcamps.appendChild(bootcampItem);
      });
    } catch (error) {
      console.error('Error al obtener los datos:', error);
    }
  }
  
  // Función para mostrar el modal de agregar usuarios
  function mostrarModalAddUser(bootcampId) {
    const modal = document.getElementById('modalAdduser');
    const form = document.getElementById('formAddUser');
    const emailInput = document.getElementById('emails');
  
    // Guardar el ID del bootcamp en el formulario
    form.onsubmit = function(event) {
      event.preventDefault();
      const userEmails = emailInput.value.split(',').map(email => email.trim());
      agregarUsuariosABootcamp(bootcampId, userEmails);
      modal.style.display = "none"; // Cerrar el modal después de enviar
    };
  
    // Mostrar el modal
    modal.style.display = "block";
  }
  
  // Función para cerrar el modal
  const cerrarModal = document.getElementById('cerrarModal');
  cerrarModal.onclick = function() {
    const modal = document.getElementById('modalAdduser');
    modal.style.display = "none";
  }
  
  // Función para cancelar la acción y cerrar el modal
  const cancelarAddUser = document.getElementById('cancelarAddUser');
  cancelarAddUser.onclick = function() {
    const modal = document.getElementById('modalAdduser');
    modal.style.display = "none";
  }
    
  
  const cerrarAddUser = document.getElementById('cerrarAddUser');
  cerrarAddUser.onclick = function() {
    const modal = document.getElementById('modalAdduser');
    modal.style.display = "none";
  }
  // Función para agregar usuarios a un bootcamp
  async function agregarUsuariosABootcamp(bootcampId, userEmails) {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
  
      const data = {
        bootcampId: bootcampId,
        userEmails: userEmails,
      };
  
      const response = await fetch('http://localhost:5001/api/bootcamp/adduser', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API al agregar usuarios');
      }
  
      const responseData = await response.json();
      if (responseData.message) {
        alert(responseData.message);
      }
    } catch (error) {
      console.error('Error al agregar usuarios al bootcamp:', error);
    }
  }
  
  // Llamamos a la función cuando se hace clic en el botón
  document.getElementById('cargarBootcamps').addEventListener('click', () => {
    obtenerBootcampsConUsuarios();
  });

  // Mostrar el modal de agregar bootcamp
document.getElementById('abrirModalAgregarBootcamp').addEventListener('click', () => {
    const modal = document.getElementById('modalAgregarBootcamp');
    modal.style.display = 'block';
  });
  
  // Cerrar el modal de agregar bootcamp
  document.getElementById('cerrarModalAgregarBootcamp').addEventListener('click', () => {
    const modal = document.getElementById('modalAgregarBootcamp');
    modal.style.display = 'none';
  });
  
  // Cancelar y cerrar el modal de agregar bootcamp
  document.getElementById('cancelarAgregarBootcamp').addEventListener('click', () => {
    const modal = document.getElementById('modalAgregarBootcamp');
    modal.style.display = 'none';
  });
  
  // Función para agregar un nuevo bootcamp
  async function agregarBootcamp(titulo, cue, descripcion) {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        console.error('No se encontró el token de autenticación');
        return;
      }
  
      const data = {
        title: titulo,
        cue: cue,
        description: descripcion,
      };
  
      const response = await fetch('http://localhost:5001/api/bootcamp', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta de la API al crear el bootcamp');
      }
  
      const responseData = await response.json();
      alert(responseData.message);
  
      // Recargar la lista de bootcamps después de agregar uno nuevo
      obtenerBootcampsConUsuarios();
  
      // Cerrar el modal
      const modal = document.getElementById('modalAgregarBootcamp');
      modal.style.display = 'none';
    } catch (error) {
      console.error('Error al agregar bootcamp:', error);
    }
  }
  
  // Manejar el envío del formulario para agregar bootcamp
  document.getElementById('formAgregarBootcamp').addEventListener('submit', (event) => {
    event.preventDefault();
  
    // Obtener los valores del formulario
    const titulo = document.getElementById('titulo').value;
    const cue = parseInt(document.getElementById('cue').value, 10);
    const descripcion = document.getElementById('descripcion').value;
  
    // Llamar a la función para agregar el bootcamp
    agregarBootcamp(titulo, cue, descripcion);
  });
  
  document.getElementById('buscarUsuarioIdBtn').addEventListener('click', async () => {
    const userId = document.getElementById('buscarUsuarioIdInput').value.trim();
  
    if (!userId) {
      alert('Por favor, ingrese un ID de usuario.');
      return;
    }
  
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch(`http://localhost:5001/api/user/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al buscar el usuario.');
      }
  
      const usuario = await response.json();
      const detalleUsuario = document.getElementById('detalleUsuario');
  
      // Mostrar los datos del usuario
      detalleUsuario.innerHTML = `
        <h3>Detalles del Usuario</h3>
        <p><strong>Nombre:</strong> ${usuario.firstName} ${usuario.lastName}</p>
        <p><strong>Email:</strong> ${usuario.email}</p>
        <p><strong>Creado:</strong> ${new Date(usuario.createdAt).toLocaleString()}</p>
        <p><strong>Actualizado:</strong> ${new Date(usuario.updatedAt).toLocaleString()}</p>
        <h4>Bootcamps Asociados</h4>
        <ul id="bootcampsUsuario">
          ${usuario.bootcamps.length > 0
            ? usuario.bootcamps.map(bootcamp => `<li>${bootcamp.title}</li>`).join('')
            : '<li>No hay bootcamps asociados.</li>'}
        </ul>
         <button id="editarUsuarioBtn">Editar Usuario</button>
      <button id="eliminarUsuarioBtn">Eliminar Usuario</button>
      `;

      // Agregar eventos para los botones reutilizando las funciones creadas
    document.getElementById('editarUsuarioBtn').addEventListener('click', () => {
        editarUsuario(usuario); // Llama a tu función de edición
      });
  
      document.getElementById('eliminarUsuarioBtn').addEventListener('click', () => {
        eliminarUsuario(usuario.id); // Llama a tu función de eliminación
      });

    } catch (error) {
      console.error('Error al buscar el usuario:', error);
      alert('No se pudo encontrar el usuario.');
    }
  });
  

  async function obtenerDetallesBootcamp(bootcampId) {
    try {
      const token = localStorage.getItem("authToken");
  
      const response = await fetch(`http://localhost:5001/api/bootcamp/${bootcampId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al buscar el bootcamp.');
      }
  
      const bootcamp = await response.json();
      const detalleBootcamp = document.getElementById('detalleBootcamp');
  
      // Mostrar los datos del bootcamp
      detalleBootcamp.innerHTML = `
        <h3>Detalles del Bootcamp</h3>
        <p><strong>Título:</strong> ${bootcamp.title}</p>
        <p><strong>CUE:</strong> ${bootcamp.cue}</p>
        <p><strong>Descripción:</strong> ${bootcamp.description}</p>
        <p><strong>Creado:</strong> ${new Date(bootcamp.createdAt).toLocaleString()}</p>
        <p><strong>Actualizado:</strong> ${new Date(bootcamp.updatedAt).toLocaleString()}</p>
        <h4>Usuarios Inscritos</h4>
        <ul id="usuariosBootcamp">
          ${bootcamp.users.length > 0
            ? bootcamp.users.map(user => `<li>${user.firstName} ${user.lastName} (${user.email})</li>`).join('')
            : '<li>No hay usuarios inscritos en este bootcamp.</li>'}
        </ul>
        <button id="editarBootcampBtn">Editar Bootcamp</button>
        <button id="eliminarBootcampBtn">Eliminar Bootcamp</button>
      `;
  
      // Agregar eventos para los botones de edición y eliminación
      document.getElementById('editarBootcampBtn').addEventListener('click', () => {
        mostrarModalEditarBootcamp(bootcamp);  // Llama a tu función de edición para bootcamps
      });
  
      document.getElementById('eliminarBootcampBtn').addEventListener('click', () => {
        eliminarBootcamp(bootcamp.id); // Llama a tu función de eliminación para bootcamps
      });
  
    } catch (error) {
      console.error('Error al buscar el bootcamp:', error);
      alert('No se pudo encontrar el bootcamp.');
    }
  }

  document.getElementById('buscarBootcampIdBtn').addEventListener('click', async () => {
    const bootcampId = document.getElementById('buscarBootcampIdInput').value.trim();
  
    if (!bootcampId) {
      alert('Por favor, ingrese un ID de bootcamp.');
      return;
    }
  
    // Llamar a la función para obtener los detalles del bootcamp
    obtenerDetallesBootcamp(bootcampId);
  });
  
  

 // Función para mostrar el modal y cargar los datos actuales del bootcamp
function mostrarModalEditarBootcamp(bootcamp) {
    // Asignamos los valores actuales al formulario
    document.getElementById('nuevoTitulo').value = bootcamp.title;
    document.getElementById('nuevoCue').value = bootcamp.cue; // Cargar el cue
    document.getElementById('nuevaDescripcion').value = bootcamp.description;
  
    // Mostramos el modal
    const modal = document.getElementById('modalEditarBootcamp');
    modal.style.display = "block";
  
    // Cuando se hace clic en la 'X', cerramos el modal
    document.getElementById('cerrarModalEditar').onclick = () => {
      modal.style.display = "none";
    };
  
    // Cuando el usuario envía el formulario
    document.getElementById('formEditarBootcamp').onsubmit = async (e) => {
      e.preventDefault();
  
      const nuevoTitulo = document.getElementById('nuevoTitulo').value;
      const nuevoCue = document.getElementById('nuevoCue').value; // Obtener el nuevo cue
      const nuevaDescripcion = document.getElementById('nuevaDescripcion').value;
  
      if (!nuevoTitulo || !nuevoCue || !nuevaDescripcion) {
        alert("Por favor, completa todos los campos.");
        return;
      }
  
      try {
        const token = localStorage.getItem("authToken");
  
        const response = await fetch(`http://localhost:5001/api/bootcamp/${bootcamp.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: nuevoTitulo,
            cue: nuevoCue, // Enviar el nuevo cue
            description: nuevaDescripcion,
          }),
        });
  
        if (!response.ok) {
          throw new Error('Error al actualizar el bootcamp.');
        }
  
        alert('Bootcamp actualizado con éxito.');
        modal.style.display = "none"; // Cerramos el modal después de guardar
  
        // Puedes actualizar la lista de bootcamps en la UI si es necesario
      } catch (error) {
        console.error('Error al actualizar el bootcamp:', error);
        alert('No se pudo actualizar el bootcamp.');
      }
    };
  }
  
  // Función para abrir el modal de edición al hacer clic en el botón de editar
 // document.getElementById('editarBootcampBtn').addEventListener('click', () => {
 //   mostrarModalEditarBootcamp(bootcamp); // Llama a la función para mostrar el modal
 // });
  
  async function eliminarBootcamp(bootcampId) {
    const token = localStorage.getItem("authToken");
    try {
      const response = await fetch(`http://localhost:5001/api/bootcamp/${bootcampId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error('Error al eliminar el bootcamp.');
      }
  
      alert('Bootcamp eliminado exitosamente.');
      // Aquí puedes limpiar la interfaz o actualizar la lista de bootcamps.
    } catch (error) {
      console.error('Error al eliminar el bootcamp:', error);
      alert('No se pudo eliminar el bootcamp.');
    }
  }
  