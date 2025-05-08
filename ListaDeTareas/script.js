const inputTarea = document.getElementById("tarea_input");
const btnAgregar = document.getElementById("btn_agregar");
const listaTarea = document.getElementById("listaTarea");
const btn_vaciar = document.getElementById("btn_vaciar");

// Cargar tareas al inicio
window.addEventListener("DOMContentLoaded", cargarDesdeLocalStorage);

btnAgregar.addEventListener("click", agregarNuevaTarea);
btn_vaciar.addEventListener("click", vaciarLista);

// Agrega nueva tarea desde input
function agregarNuevaTarea() {
  const textoTarea = inputTarea.value.trim();
  if (textoTarea === "") {
    alert("Por favor, escribe una tarea");
    return;
  }
  crearElementoTarea(textoTarea);
  inputTarea.value = "";
  guardarEnLocalStorage();
}

// Crear elemento <li> con botones y menú de estado
function crearElementoTarea(textoTarea) {
  const nuevaTarea = document.createElement("li");

  const spanTexto = document.createElement("span");
  spanTexto.textContent = textoTarea;

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
    inputEdicion.value = spanTexto.textContent;
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
    spanTexto.textContent = nuevoTexto;
    nuevaTarea.replaceChild(spanTexto, nuevaTarea.querySelector("input"));
    nuevaTarea.replaceChild(btnEditar, btnGuardar);
    guardarEnLocalStorage();
  });

  // Botón de estado
  const btnEstado = document.createElement("button");
  btnEstado.textContent = "Estado";
  btnEstado.classList.add("btn-estado");
  const menuEstado = document.createElement("ul");
  menuEstado.classList.add("estado-menu");
  const estados = ["Sin hacer", "En proceso", "Terminada"];
  estados.forEach(estado => {
    const estadoItem = document.createElement("li");
    estadoItem.textContent = estado;
    estadoItem.addEventListener("click", () => {
      spanTexto.dataset.estado = estado;
      actualizarColorEstado(btnEstado, estado);
      menuEstado.style.display = "none";
      guardarEnLocalStorage();
    });
    menuEstado.appendChild(estadoItem);
  });
  btnEstado.addEventListener("click", () => {
    menuEstado.style.display = menuEstado.style.display === "none" ? "block" : "none";
  });
  menuEstado.style.display = "none";

  nuevaTarea.appendChild(btnEstado);
  nuevaTarea.appendChild(spanTexto);
  nuevaTarea.appendChild(btnEditar);
  nuevaTarea.appendChild(btnEliminar);
  nuevaTarea.appendChild(menuEstado);
  listaTarea.appendChild(nuevaTarea);

  return nuevaTarea; // Devolver el elemento creado
}

// Función para actualizar el color del botón de estado
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
    tareas.push({texto: span.textContent, estado: span.dataset.estado || "Sin hacer"});
  });
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Cargar tareas desde localStorage al iniciar
function cargarDesdeLocalStorage() {
  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareasGuardadas.forEach(t => {
    const tareaElemento = crearElementoTarea(t.texto);
    const spanTexto = tareaElemento.querySelector("span");
    spanTexto.dataset.estado = t.estado;
    const btnEstado = tareaElemento.querySelector(".btn-estado");
    actualizarColorEstado(btnEstado, t.estado);
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

inputTarea.addEventListener("keydown", function(e) {
  if (e.key === "Enter") {
    agregarNuevaTarea();
  }
});
