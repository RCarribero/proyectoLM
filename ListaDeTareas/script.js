// Referencias a elementos del HTTML
const inputTarea = document.getElementById("tarea_input");
const btnAgregar = document.getElementById("btn_agregar");
const listaTarea = document.getElementById("listaTarea");
const btn_vaciar = document.getElementById("btn_vaciar");
const selectImportancia = document.getElementById("tarea_importancia");
const inputMensajeImportante = document.getElementById("mensaje_importante");

// Nos muestra y nos oculta el mensaje importante según la importancia seleccionada
selectImportancia.addEventListener("change", function() {
    inputMensajeImportante.style.display = this.value === "importante" ? "block" : "none";
});

// Solicitar permiso de notificaciones al cargar la página
window.addEventListener("DOMContentLoaded", () => {
    cargarDesdeLocalStorage(); // Cargar tareas guardadas al iniciar
    if ("Notification" in window && Notification.permission !== "granted") {
        Notification.requestPermission(); // Pedir permiso para notificaciones
    }
});

// Agregamos una nueva tarea al hacer clic en el botón
btnAgregar.addEventListener("click", agregarNuevaTarea);

// Vaciamos la lista de tareas al hacer clic en el botón
btn_vaciar.addEventListener("click", vaciarLista);

// Agregamos nueva tarea desde el input
function agregarNuevaTarea() {
    const textoTarea = inputTarea.value.trim();
    const importancia = selectImportancia.value;
    const mensajeImportante = inputMensajeImportante.value.trim();

    if (textoTarea === "") {
        alert("Por favor, escribe una tarea"); // Validación de entrada vacía
        return;
    }

    // Crear el elemento de la tarea y reiniciar los inputs
    crearElementoTarea(textoTarea, importancia, mensajeImportante, "Sin hacer");
    inputTarea.value = "";
    selectImportancia.value = "normal";
    inputMensajeImportante.value = "";
    inputMensajeImportante.style.display = "none";
    guardarEnLocalStorage(); // Guardar cambios en localStorage

    // Mostrar notificación si está permitido
    if ("Notification" in window && Notification.permission === "granted") {
        let titulo = importancia === "importante" ? "¡Tarea importante añadida!" : "¡Tarea añadida!";
        let cuerpo = mensajeImportante !== "" ? mensajeImportante : textoTarea;
        new Notification(titulo, {
            body: cuerpo,
            icon: "https://cdn-icons-png.flaticon.com/512/1828/1828884.png"
        });
    }
}

// Crear un elemento <li> para la tarea
function crearElementoTarea(textoTarea, importancia = "normal", mensajeImportante = "", estado = "Sin hacer") {
    const nuevaTarea = document.createElement("li");
    nuevaTarea.classList.add(importancia); // Clase según la importancia

    // pone el emoji según la importancia
    let emoji = "";
    if (importancia === "importante") emoji = "⭐️";
    else if (importancia === "normal") emoji = "✅";
    else if (importancia === "opcional") emoji = "💡";

    // Crear el texto de la tarea con los datos que le hemos pasado
    const spanTexto = document.createElement("span");
    spanTexto.textContent = `${emoji} ${textoTarea}`;
    spanTexto.dataset.importancia = importancia;
    spanTexto.dataset.mensaje = mensajeImportante;
    spanTexto.dataset.estado = estado;

    // Botón para cambiar el estado de la tarea que queramos
    const btnEstado = document.createElement("button");
    btnEstado.textContent = estado;
    btnEstado.classList.add("btn-estado");
    actualizarColorEstado(btnEstado, estado); // Actualizar color según el estado

    // Menú para seleccionar el estado
    const menuEstado = document.createElement("ul");
    menuEstado.classList.add("estado-menu");
    const estados = ["Sin hacer", "En proceso", "Terminada"];
    estados.forEach(est => {
        const estadoItem = document.createElement("li");
        estadoItem.textContent = est;
        estadoItem.addEventListener("click", () => {
            spanTexto.dataset.estado = est; // Actualizar estado en los datos
            btnEstado.textContent = est;
            actualizarColorEstado(btnEstado, est);
            menuEstado.style.display = "none";
            guardarEnLocalStorage(); // Guardar cambios
        });
        menuEstado.appendChild(estadoItem);
    });
    btnEstado.addEventListener("click", () => {
        menuEstado.style.display = menuEstado.style.display === "none" ? "block" : "none";
    });
    menuEstado.style.display = "none";

    // Botón para eliminar la tarea
    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () => {
        listaTarea.removeChild(nuevaTarea); // Eliminar tarea del DOM
        guardarEnLocalStorage(); // Guardar cambios en el localStorage
    });

    // Botón para editar la tarea
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
            if (e.key === "Enter") btnGuardar.click(); // Guardar los datos que le ponemos al presionar Enter
        });
    });

    // Botón para guardar cambios tras editar
    const btnGuardar = document.createElement("button");
    btnGuardar.textContent = "Guardar";
    btnGuardar.classList.add("btn-guardar");
    btnGuardar.addEventListener("click", () => {
        const nuevoTexto = nuevaTarea.querySelector("input").value.trim();
        spanTexto.textContent = `${emoji} ${nuevoTexto}`;
        nuevaTarea.replaceChild(spanTexto, nuevaTarea.querySelector("input"));
        nuevaTarea.replaceChild(btnEditar, btnGuardar);
        guardarEnLocalStorage(); // Guardar cambios en el localStorage
    });

    // Añadir elementos al <li> y al DOM
    nuevaTarea.appendChild(btnEstado);
    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEditar);
    nuevaTarea.appendChild(btnEliminar);
    nuevaTarea.appendChild(menuEstado);
    listaTarea.appendChild(nuevaTarea);

    return nuevaTarea;
}

// Actualizar el color del botón de estado según el estado actual
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
        const texto = span.textContent.replace(/^[⭐️✅💡] /, ""); // Quitar emoji
        const importancia = span.dataset.importancia || "normal";
        const mensaje = span.dataset.mensaje || "";
        const estado = span.dataset.estado || "Sin hacer";
        tareas.push({ texto, importancia, mensaje, estado });
    });
    localStorage.setItem("tareas", JSON.stringify(tareas)); // Guardar en localStorage
}

// Cargar tareas desde localStorage al iniciar
function cargarDesdeLocalStorage() {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(t => {
        crearElementoTarea(t.texto, t.importancia, t.mensaje, t.estado); // Crear tareas desde los datos guardados
    });
}

// Vaciar lista y limpiar localStorage
function vaciarLista() {
    if (listaTarea.children.length === 0) {
        alert("La lista ya está vacía"); // Validación si no hay tareas
        return;
    }
    while (listaTarea.firstChild) {
        listaTarea.removeChild(listaTarea.firstChild); // Eliminar todas las tareas que haya en la lista
    }
    guardarEnLocalStorage(); // Limpiar localStorage
}

const btnContar = document.getElementById("btn_contar");


// Contar tareas por importancia
btnContar.addEventListener("click", () => {
    const tareas = listaTarea.querySelectorAll("li span");
    let importantes = 0, normales = 0, opcionales = 0;

    tareas.forEach(span => {
        const importancia = span.dataset.importancia;
        if (importancia === "importante") importantes++;
        else if (importancia === "normal") normales++;
        else if (importancia === "opcional") opcionales++;
    });

    alert(`Tareas importantes: ${importantes}\nTareas normales: ${normales}\nTareas opcionales: ${opcionales}`);
});


// Agregar tarea al presionar Enter en el input
inputTarea.addEventListener("keydown", function (e) {
    if (e.key === "Enter") {
        agregarNuevaTarea();
    }
});
