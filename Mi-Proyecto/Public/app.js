'use strict';

console.log('app.js cargado correctamente');

// ============================================
// CLASES (Actividad 20)
// ============================================

class Persona {
  #id;

  constructor(nombre, edad) {
    this.nombre = nombre;
    this.edad = edad;
    this.#id = Persona.#generarId();
  }

  static #contador = 0;
  static #generarId() {
    return ++Persona.#contador;
  }

  get id() {
    return this.#id;
  }

  rol() {
    return 'Persona';
  }

  mostrarInfo() {
    return `${this.rol()}: ${this.nombre} (${this.edad} años)`;
  }

  toString() {
    return this.mostrarInfo();
  }
}

class Alumno extends Persona {
  constructor(nombre, edad, matricula, correo) {
    super(nombre, edad);
    this.matricula = matricula;
    this.correo = correo;
    this.calificaciones = [];
  }

  rol() {
    return 'Alumno';
  }

  agregarCalificacion(nota) {
    if (typeof nota !== 'number' || nota < 0 || nota > 10) {
      throw new Error('Calificación inválida');
    }
    this.calificaciones.push(nota);
  }

  get promedio() {
    if (this.calificaciones.length === 0) return 0;
    const suma = this.calificaciones.reduce((a, b) => a + b, 0);
    return suma / this.calificaciones.length;
  }

  mostrarInfo() {
    return `${super.mostrarInfo()} — Matrícula: ${this.matricula}`;
  }
}

class Maestro extends Persona {
  constructor(nombre, edad, empleadoId, materia) {
    super(nombre, edad);
    this.empleadoId = empleadoId;
    this.materia = materia;
  }

  rol() {
    return 'Maestro';
  }

  mostrarInfo() {
    return `${super.mostrarInfo()} — Materia: ${this.materia}`;
  }
}

class Administrador extends Persona {
  constructor(nombre, edad, departamento) {
    super(nombre, edad);
    this.departamento = departamento;
  }

  rol() {
    return 'Administrador';
  }
}

// ============================================
// MODELO Y VARIABLES GLOBALES
// ============================================

const btnMensaje   = document.querySelector('#btn-mensaje');
const btnPromedio  = document.querySelector('#btn-promedio');
const btnLimpiar   = document.querySelector('#btn-limpiar');
const resultado    = document.querySelector('#resultado');
const formAlumno   = document.querySelector('#form-alumno');

let alumnos = [];   // Ahora contiene instancias de Alumno

// ============================================
// UTILIDADES
// ============================================

function mostrarResultado(mensaje, tipo = 'ok') {
  resultado.textContent = mensaje;
  resultado.classList.remove('ok', 'error');
  resultado.classList.add('visible', tipo);
}

// ============================================
// RENDERIZADO (VISTA)
// ============================================

function render() {
  const tbody = document.querySelector('#tabla-alumnos tbody');
  tbody.innerHTML = '';

  if (alumnos.length === 0) {
    const filaVacia = document.createElement('tr');
    filaVacia.innerHTML = `<td colspan="6" class="vacio">Sin alumnos registrados</td>`;
    tbody.appendChild(filaVacia);
    actualizarResumen();
    return;
  }

  alumnos.forEach((alumno) => {
    const fila = document.createElement('tr');
    fila.dataset.id = alumno.id;

    fila.innerHTML = `
      <td>${alumno.matricula}</td>
      <td>${alumno.nombre}</td>
      <td>${alumno.edad}</td>
      <td>${alumno.correo}</td>
      <td>${alumno.promedio.toFixed(2)}</td>
      <td class="acciones">
        <button class="btn-editar" data-accion="editar">Editar</button>
        <button class="btn-eliminar" data-accion="eliminar">Eliminar</button>
      </td>
    `;

    tbody.appendChild(fila);
  });

  actualizarResumen();
}

function actualizarResumen() {
  document.querySelector('#total-alumnos').textContent = alumnos.length;

  if (alumnos.length === 0) {
    document.querySelector('#promedio-general').textContent = '—';
    document.querySelector('#ultimo-alumno').textContent = '—';
    return;
  }

  const sumaPromedios = alumnos.reduce((acc, a) => acc + a.promedio, 0);
  const promedioGeneral = sumaPromedios / alumnos.length;

  document.querySelector('#promedio-general').textContent = promedioGeneral.toFixed(2);
  document.querySelector('#ultimo-alumno').textContent = alumnos[alumnos.length - 1].nombre;
}

// ============================================
// CRUD
// ============================================

function eliminarAlumno(id) {
  if (!confirm('¿Eliminar este alumno?')) return;
  alumnos = alumnos.filter(a => a.id !== id);
  render();
}

function editarAlumno(id) {
  const alumno = alumnos.find(a => a.id === id);
  if (!alumno) return;

  const nuevoNombre = prompt('Nombre:', alumno.nombre);
  if (nuevoNombre === null) return;

  const nuevaEdad = prompt('Edad:', alumno.edad);
  if (nuevaEdad === null) return;

  const nuevoCorreo = prompt('Correo:', alumno.correo);
  if (nuevoCorreo === null) return;

  if (nuevoNombre.trim()) alumno.nombre = nuevoNombre.trim();
  if (Number(nuevaEdad) > 0) alumno.edad = Number(nuevaEdad);
  if (nuevoCorreo.trim()) alumno.correo = nuevoCorreo.trim();

  render();
  mostrarResultado('Alumno actualizado.');
}

// ============================================
// EVENTOS
// ============================================

btnMensaje.addEventListener('click', () => {
  if (resultado.classList.contains('visible')) {
    resultado.classList.remove('visible');
  } else {
    mostrarResultado('¡Hola! Este mensaje vive solo en el navegador.', 'ok');
  }
});

formAlumno.addEventListener('submit', (e) => {
  e.preventDefault();

  const nombre    = document.querySelector('#nombre').value.trim();
  const matricula = document.querySelector('#matricula').value.trim();
  const edad      = Number(document.querySelector('#edad').value);
  const correo    = document.querySelector('#correo').value.trim();
  const c1        = document.querySelector('#cal1').value;
  const c2        = document.querySelector('#cal2').value;
  const c3        = document.querySelector('#cal3').value;

  if (!nombre || !matricula || !edad || !correo) {
    mostrarResultado('Completa todos los campos.', 'error');
    return;
  }

  const nuevoAlumno = new Alumno(nombre, edad, matricula, correo);

  [c1, c2, c3].forEach((valor) => {
    if (valor !== '') {
      try {
        nuevoAlumno.agregarCalificacion(Number(valor));
      } catch (err) {
        mostrarResultado(err.message, 'error');
      }
    }
  });

  alumnos.push(nuevoAlumno);
  render();
  formAlumno.reset();
  mostrarResultado(`Alumno "${nombre}" registrado.`);
});

document.querySelector('#tabla-alumnos tbody').addEventListener('click', (e) => {
  const boton = e.target.closest('button[data-accion]');
  if (!boton) return;

  const fila = boton.closest('tr');
  const id = Number(fila.dataset.id);
  const accion = boton.dataset.accion;

  if (accion === 'eliminar') {
    eliminarAlumno(id);
  } else if (accion === 'editar') {
    editarAlumno(id);
  }
});

btnLimpiar.addEventListener('click', (e) => {
  e.preventDefault();
  formAlumno.reset();
  mostrarResultado('Formulario limpio.', 'ok');
});

btnPromedio.addEventListener('click', () => {
  const v1 = document.querySelector('#cal1').value;
  const v2 = document.querySelector('#cal2').value;
  const v3 = document.querySelector('#cal3').value;

  if (v1 === '' || v2 === '' || v3 === '') {
    mostrarResultado('Ingresa las 3 calificaciones antes de calcular.', 'error');
    return;
  }

  const c1 = Number(v1);
  const c2 = Number(v2);
  const c3 = Number(v3);

  if (isNaN(c1) || isNaN(c2) || isNaN(c3)) {
    mostrarResultado('Las calificaciones deben ser números válidos.', 'error');
    return;
  }

  const promedio = (c1 + c2 + c3) / 3;
  mostrarResultado(`Promedio: ${promedio.toFixed(2)}`, 'ok');
});

// ============================================
// ARRANQUE
// ============================================

render();