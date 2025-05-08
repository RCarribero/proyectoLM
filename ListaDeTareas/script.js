const inputTarea = document.getElementById("tarea_input");
const btnAgregar = document.getElementById("btn_agregar");
const listaTarea = document.getElementById("listaTarea");
const btn_vaciar = document.getElementById("btn_vaciar");
const checkImportante = document.getElementById("tarea_importante");
const inputMensajeImportante = document.getElementById("mensaje_importante");

// Mostrar/ocultar input de mensaje importante
checkImportante.addEventListener("change", function() {
    inputMensajeImportante.style.display = this.checked ? "block" : "none";
});
const selectImportancia = document.getElementById("tarea_importancia"); // NUEVO

// Solicitar permiso de notificaciones al cargar
window.addEventListener("DOMContentLoaded", () => {
    cargarDesdeLocalStorage();
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission();
    }
});

btnAgregar.addEventListener("click", agregarNuevaTarea);
btn_vaciar.addEventListener("click", vaciarLista);

document.getElementById("btn_probar_notificacion").addEventListener("click", function() {
    if ("Notification" in window) {
        if (Notification.permission === "granted") {
            new Notification("¡Esto es una prueba!", {
                body: "Notificación de tarea importante funcionando.",
                icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
            });
        } else {
            Notification.requestPermission().then(permiso => {
                if (permiso === "granted") {
                    new Notification("¡Esto es una prueba!", {
                        body: "Notificación de tarea importante funcionando.",
                        icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
                    });
                } else {
                    alert("No se concedieron permisos para notificaciones.");
                }
            });
        }
    } else {
        alert("Tu navegador no soporta notificaciones.");
    }
});

// Agrega nueva tarea desde input
function agregarNuevaTarea() {
    const textoTarea = inputTarea.value.trim();
    const importancia = selectImportancia.value; // Obtiene la importancia seleccionada

    if (textoTarea === "") {
        alert("Por favor, escribe una tarea");
        return;
    }

    crearElementoTarea(textoTarea, importancia, mensajeImportante, "Sin hacer");
    inputTarea.value = "";
    selectImportancia.value = "normal"; // Restablece el selector a "normal"
    guardarEnLocalStorage();
}

// Crear elemento <li> con botones y menú de estado
function crearElementoTarea(textoTarea, importancia = "normal", mensajeImportante = "", estado = "Sin hacer") {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add(importancia); // Aplica la clase según la importancia

    // Determina el emoji según la importancia
    let emoji = "";
    if (importancia === "importante") emoji = "⭐️"; // Cambiado a estrella roja
    else if (importancia === "normal") emoji = "✅"; // Emoji para normal
    else if (importancia === "opcional") emoji = "💡"; // Emoji para opcional

    const spanTexto = document.createElement("span");
    spanTexto.textContent = `${emoji} ${textoTarea}`; // Agrega el emoji al texto
    spanTexto.dataset.importante = esImportante;
    spanTexto.dataset.mensaje = mensajeImportante;
    spanTexto.dataset.estado = estado;

    // Botón de estado
    const btnEstado = document.createElement("button");
    btnEstado.textContent = estado; // Mostrar el estado actual en el botón
    btnEstado.classList.add("btn-estado");
    actualizarColorEstado(btnEstado, estado);

    const menuEstado = document.createElement("ul");
    menuEstado.classList.add("estado-menu");
    const estados = ["Sin hacer", "En proceso", "Terminada"];
    estados.forEach(est => {
        const estadoItem = document.createElement("li");
        estadoItem.textContent = est;
        estadoItem.addEventListener("click", () => {
            spanTexto.dataset.estado = est;
            btnEstado.textContent = est; // Cambia el texto del botón al nuevo estado
            actualizarColorEstado(btnEstado, est);
            menuEstado.style.display = "none";
            guardarEnLocalStorage();
        });
        menuEstado.appendChild(estadoItem);
    });
    btnEstado.addEventListener("click", () => {
        menuEstado.style.display = menuEstado.style.display === "none" ? "block" : "none";
    });
    menuEstado.style.display = "none";

    // Botón eliminar
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () => {
        listaTarea.removeChild(nuevaTarea);
        guardarEnLocalStorage();
    });

    // Botón editar
    const btnEditar = document.createElement("button");
    btnEditar.textContent = "Editar";
    btnEditar.classList.add("btn-Editar");
    btnEditar.addEventListener("click", () => {
        const inputEdicion = document.createElement("input");
        inputEdicion.type = "text";
        inputEdicion.value = textoTarea;
        inputEdicion.classList.add("input-edicion");

        nuevaTarea.replaceChild(inputEdicion, spanTexto);
        nuevaTarea.replaceChild(btnGuardar, btnEditar);
        inputEdicion.focus();

        inputEdicion.addEventListener("keydown", (e) => {
            if (e.key === "Enter") btnGuardar.click();
        });
    });

    // Botón guardar (edición)
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.addEventListener("click", () => {
        const nuevoTexto = nuevaTarea.querySelector("input").value.trim();
        if (esImportante) {
            spanTexto.textContent = "★ " + nuevoTexto;
        } else {
            spanTexto.textContent = `${emoji} ${nuevoTexto}`;
        }
        nuevaTarea.replaceChild(spanTexto, nuevaTarea.querySelector("input"));
        nuevaTarea.replaceChild(btnEditar, btnGuardar);
        guardarEnLocalStorage();
    });

    nuevaTarea.appendChild(btnEstado);
    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEditar);
    nuevaTarea.appendChild(btnEliminar);
    nuevaTarea.appendChild(menuEstado);
    listaTarea.appendChild(nuevaTarea);

    return nuevaTarea;
}

// Actualiza el color del botón de estado
function actualizarColorEstado(btn, estado) {
    btn.classList.remove("estado-sin-hacer", "estado-en-proceso", "estado-terminada");
    if (estado === "Sin hacer") {
        btn.classList.add("estado-sin-hacer");
    } else if (estado === "En proceso") {
        btn.classList.add("estado-en-proceso");
    } else if (estado === "Terminada") {
        btn.classList.add("estado-terminada");
    }
}

// Guardar tareas actuales en localStorage
function guardarEnLocalStorage() {
    const tareas = [];
    listaTarea.querySelectorAll("li span").forEach(span => {
        const texto = span.textContent.replace(/^★ /, "");
        const importante = span.dataset.importante === "true" || span.textContent.startsWith("★ ");
        const mensaje = span.dataset.mensaje || "";
        const estado = span.dataset.estado || "Sin hacer";
        tareas.push({ texto, importante, mensaje, estado });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Cargar tareas desde localStorage al iniciar
function cargarDesdeLocalStorage() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(t => {
        crearElementoTarea(t.texto, t.importante, t.mensaje, t.estado);
    });
}

// Vaciar lista y limpiar localStorage
function vaciarLista() {
    if (listaTarea.children.length === 0) {
        alert("La lista ya está vacía");
        return;
    }
    while (listaTarea.firstChild) {
        listaTarea.removeChild(listaTarea.firstChild);
    }
    guardarEnLocalStorage();
}

inputTarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        agregarNuevaTarea();
    }
});
