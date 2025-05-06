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

// Crear elemento <li> con botones
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
  
    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEditar);
    nuevaTarea.appendChild(btnEliminar);
    listaTarea.appendChild(nuevaTarea);
  }
  

// Guardar tareas actuales en localStorage
function guardarEnLocalStorage() {
  const tareas = [];
  listaTarea.querySelectorAll("li span").forEach(span => {
    tareas.push(span.textContent);
  });
  localStorage.setItem("tareas", JSON.stringify(tareas));
}

// Cargar tareas desde localStorage al iniciar
function cargarDesdeLocalStorage() {
  const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
  tareasGuardadas.forEach(t => crearElementoTarea(t));
}

// Vaciar lista y limpiar localStorage
function vaciarLista() {
  listaTarea.innerHTML = "";
  localStorage.removeItem("tareas");
}
