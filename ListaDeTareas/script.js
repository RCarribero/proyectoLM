const inputTarea = document.getElementById("tarea_input");
const btnAgregar = document.getElementById("btn_agregar");
const listaTarea = document.getElementById("listaTarea");
const btn_vaciar = document.getElementById("btn_vaciar");
const checkImportante = document.getElementById("tarea_importante"); // NUEVO
const inputMensajeImportante = document.getElementById("mensaje_importante"); // NUEVO
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

// Agrega nueva tarea desde input
function agregarNuevaTarea() {
    const textoTarea = inputTarea.value.trim();
    const importancia = selectImportancia.value; // Obtiene la importancia seleccionada

    if (textoTarea === "") {
        alert("Por favor, escribe una tarea");
        return;
    }

    crearElementoTarea(textoTarea, importancia);
    inputTarea.value = "";
    selectImportancia.value = "normal"; // Restablece el selector a "normal"
    guardarEnLocalStorage();
}

// Crear elemento <li> con botones
function crearElementoTarea(textoTarea, importancia = "normal") {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add(importancia); // Aplica la clase según la importancia

    // Determina el emoji según la importancia
    let emoji = "";
    if (importancia === "importante") emoji = "⭐️"; // Cambiado a estrella roja
    else if (importancia === "normal") emoji = "✅"; // Emoji para normal
    else if (importancia === "opcional") emoji = "💡"; // Emoji para opcional

    const spanTexto = document.createElement("span");
    spanTexto.textContent = `${emoji} ${textoTarea}`; // Agrega el emoji al texto

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () => {
        listaTarea.removeChild(nuevaTarea);
        guardarEnLocalStorage();
    });

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

    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.addEventListener("click", () => {
        const nuevoTexto = nuevaTarea.querySelector("input").value.trim();
        spanTexto.textContent = `${emoji} ${nuevoTexto}`;
        nuevaTarea.replaceChild(spanTexto, nuevaTarea.querySelector("input"));
        nuevaTarea.replaceChild(btnEditar, btnGuardar);
        guardarEnLocalStorage();
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEditar);
    nuevaTarea.appendChild(btnEliminar);
    listaTarea.appendChild(nuevaTarea);
}

// Guardar tareas actuales en localStorage (ahora guarda si es importante)
function guardarEnLocalStorage() {
    const tareas = [];
    listaTarea.querySelectorAll("li span").forEach(span => {
        const texto = span.textContent.replace(/^★ /, "");
        const importante = span.textContent.startsWith("★ ");
        tareas.push({ texto, importante });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Cargar tareas desde localStorage al iniciar
function cargarDesdeLocalStorage() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(t => crearElementoTarea(t.texto, t.importante));
}

// Vaciar lista y limpiar localStorage
function vaciarLista() {
    if (listaTarea.children.length === 0) {
        alert("La lista ya esta vacia");
        return;
    }
    while (listaTarea.firstChild) {
        listaTarea.removeChild(listaTarea.firstChild);
    }
}

btnAgregar.addEventListener("click", agregarNuevaTarea);
btn_vaciar.addEventListener("click", vaciarLista);

inputTarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        agregarNuevaTarea();
    }
});

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

// Puedes ejecutar esto en la consola del navegador para volver a pedir el permiso:
Notification.requestPermission().then(function(permission) {
    alert('Permiso actual: ' + permission);
});