const inputTarea = document.getElementById("tarea_input");
const btnAgregar = document.getElementById("btn_agregar");
const listaTarea = document.getElementById("listaTarea");
const btn_vaciar = document.getElementById("btn_vaciar");

function agregarNuevaTarea() {
    const textoTarea = inputTarea.value.trim();
    if (textoTarea === "") {
        alert("Porfavor, escribe una tarea");
        return;
    }
    const nuevaTarea = document.createElement("li");

    // Crear un span para el texto de la tarea
    const spanTexto = document.createElement("span");
    spanTexto.textContent = textoTarea;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "Eliminar";
    btnEliminar.classList.add("btn-eliminar");
    btnEliminar.addEventListener("click", () => {
        listaTarea.removeChild(nuevaTarea);
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
        inputEdicion.focus();

        const btnGuardar = document.createElement("button");
        btnGuardar.textContent = "Guardar";
        btnGuardar.classList.add("btn-guardar");
        nuevaTarea.replaceChild(btnGuardar, btnEditar);

        btnGuardar.addEventListener("click", () => {
            spanTexto.textContent = inputEdicion.value.trim();
            nuevaTarea.replaceChild(spanTexto, inputEdicion);
            nuevaTarea.replaceChild(btnEditar, btnGuardar);
        });

        inputEdicion.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                btnGuardar.click();
            }
        });
    });

    nuevaTarea.appendChild(spanTexto);
    nuevaTarea.appendChild(btnEditar);
    nuevaTarea.appendChild(btnEliminar);
    listaTarea.appendChild(nuevaTarea);
    inputTarea.value = "";
}

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

inputTarea.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
        agregarNuevaTarea();
    }
});