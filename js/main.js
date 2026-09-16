/* =============================================================
   MORIA — Trabajo Práctico Programación IV (UTN)
   JavaScript puro, sin librerías ni frameworks
============================================================= */

document.addEventListener('DOMContentLoaded', () => {
  inicializarMenu();
  inicializarFrases();
  inicializarQuiz();
  inicializarContacto();
  inicializarGaleria();
});

/* -------------------------------------------------------------
   1. MENÚ HAMBURGUESA (header sticky, sección 1 del HTML)
------------------------------------------------------------- */
function inicializarMenu() {
  const boton = document.getElementById('menuToggle');
  const nav = document.getElementById('nav-principal');

  if (!boton || !nav) return;

  function cerrarSubmenus() {
    nav.querySelectorAll('.nav__caret').forEach((caret) => {
      caret.setAttribute('aria-expanded', 'false');
    });
    nav.querySelectorAll('.nav__submenu--abierto').forEach((submenu) => {
      submenu.classList.remove('nav__submenu--abierto');
    });
  }

  boton.addEventListener('click', () => {
    const abierto = boton.getAttribute('aria-expanded') === 'true';
    boton.setAttribute('aria-expanded', String(!abierto));
    boton.setAttribute('aria-label', abierto ? 'Abrir menú de navegación' : 'Cerrar menú de navegación');
    nav.classList.toggle('nav--abierta', !abierto);
    if (abierto) cerrarSubmenus();
  });

  // En mobile no hay hover: el botón ▾ abre/cierra su submenú.
  nav.querySelectorAll('.nav__caret').forEach((caret) => {
    caret.addEventListener('click', () => {
      const submenu = caret.nextElementSibling;
      if (!submenu) return;
      const abierto = caret.getAttribute('aria-expanded') === 'true';
      caret.setAttribute('aria-expanded', String(!abierto));
      submenu.classList.toggle('nav__submenu--abierto', !abierto);
    });
  });

  // Al elegir una sección desde el menú mobile, lo cerramos.
  nav.querySelectorAll('a').forEach((enlace) => {
    enlace.addEventListener('click', () => {
      boton.setAttribute('aria-expanded', 'false');
      boton.setAttribute('aria-label', 'Abrir menú de navegación');
      nav.classList.remove('nav--abierta');
      cerrarSubmenus();
    });
  });
}

/* -------------------------------------------------------------
   6. FRASES — "EL IDIOMA DE LA ONE" (clip real de YouTube al tocar play)
------------------------------------------------------------- */
function inicializarFrases() {
  const tarjetas = document.querySelectorAll('.card-frase__video');
  if (!tarjetas.length) return;

  // Solo puede reproducirse un clip a la vez.
  let contenedorActivo = null;

  function mostrarMiniatura(contenedor) {
    const videoId = contenedor.dataset.videoId;
    const etiqueta = contenedor.dataset.label || 'Reproducir clip';

    contenedor.innerHTML = '';

    const img = document.createElement('img');
    img.src = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    img.alt = etiqueta;
    img.loading = 'lazy';

    const boton = document.createElement('button');
    boton.type = 'button';
    boton.className = 'card-frase__play';
    boton.setAttribute('aria-label', etiqueta);
    boton.textContent = '▶';
    boton.addEventListener('click', () => reproducirClip(contenedor));

    contenedor.appendChild(img);
    contenedor.appendChild(boton);
  }

  function reproducirClip(contenedor) {
    if (contenedorActivo && contenedorActivo !== contenedor) {
      mostrarMiniatura(contenedorActivo);
    }

    const videoId = contenedor.dataset.videoId;
    const etiqueta = contenedor.dataset.label || 'Reproducir clip';

    contenedor.innerHTML = '';

    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.title = etiqueta;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.allowFullscreen = true;

    contenedor.appendChild(iframe);
    contenedorActivo = contenedor;
  }

  tarjetas.forEach((contenedor) => {
    const boton = contenedor.querySelector('.card-frase__play');
    if (boton) boton.addEventListener('click', () => reproducirClip(contenedor));
  });
}

/* -------------------------------------------------------------
   7. QUIZ — "¿QUÉ MORIA SOS?"
------------------------------------------------------------- */

// Cada opción suma puntos a un tipo de Moria.
const PREGUNTAS_QUIZ = [
  {
    texto: 'Te cancelan un plan a último momento. ¿Qué hacés?',
    opciones: [
      { texto: 'Me encierro en el baño a llorar un rato', tipo: 'llorando' },
      { texto: 'Mando un audio de WhatsApp que no van a olvidar', tipo: 'puteando' },
      { texto: 'Llamo a algún bebote para que me consuele', tipo: 'beboteo' },
      { texto: 'Aviso que ya tenía planes mejores', tipo: 'diva' },
    ],
  },
  {
    texto: 'Alguien te copia el look en una fiesta. ¿Cómo reaccionás?',
    opciones: [
      { texto: 'Me hago la fuerte, pero por dentro lloro', tipo: 'llorando' },
      { texto: 'La cruzo y le digo cuatro cosas', tipo: 'puteando' },
      { texto: 'Le guiño un ojo: "copiame el look, pero no el bebote"', tipo: 'beboteo' },
      { texto: 'Me cambio ahí mismo para no repetir', tipo: 'diva' },
    ],
  },
  {
    texto: 'Un cronista te hace una pregunta incómoda en un móvil en vivo.',
    opciones: [
      { texto: 'Se me quiebra la voz en el aire', tipo: 'llorando' },
      { texto: 'Le contesto con una puteada bien elegante', tipo: 'puteando' },
      { texto: 'Le tiro un beso al camarógrafo y cambio de tema', tipo: 'beboteo' },
      { texto: 'Corto el móvil y sigo caminando', tipo: 'diva' },
    ],
  },
  {
    texto: 'Tu frase de cabecera con el grupo de amigas es:',
    opciones: [
      { texto: '"Che, ¿lloramos juntas un rato?"', tipo: 'llorando' },
      { texto: '"Andate a cagar, pero con amor"', tipo: 'puteando' },
      { texto: '"¿Vieron el bebote que se sentó en la mesa de al lado?"', tipo: 'beboteo' },
      { texto: '"Yo ya dije todo, ahora que hablen ellos"', tipo: 'diva' },
    ],
  },
  {
    texto: 'En una entrevista de trabajo te preguntan tu mayor defecto.',
    opciones: [
      { texto: 'Me pongo sensible con mucha facilidad', tipo: 'llorando' },
      { texto: 'Digo lo que pienso, sin filtro', tipo: 'puteando' },
      { texto: 'Me distraigo si hay un bebote cerca', tipo: 'beboteo' },
      { texto: 'No tengo defectos, tengo estilo', tipo: 'diva' },
    ],
  },
];

// Ficha de resultado por cada tipo de Moria.
const RESULTADOS_QUIZ = {
  llorando: {
    titulo: 'Moria Llorando',
    descripcion:
      'Sos la Moria más humana: sentís todo con el corazón en la mano y no le tenés miedo a mostrarte sensible frente a cámara.',
    frase: 'Si querés llorar, llorá.',
    imagen: 'img/quiz-llorando.png',
  },
  puteando: {
    titulo: 'Moria Puteando',
    descripcion:
      'No te la banca nadie: decís lo que pensás en el momento exacto en que lo pensás, sin googlear las consecuencias.',
    frase: '¿Quiénes son?',
    imagen: 'img/quiz-puteando.png',
  },
  beboteo: {
    titulo: 'Moria Bebotera',
    descripcion:
      'Sos la Moria coqueta: no hay notero, invitado ni asado donde no se te escape un piropo. Para vos, el mundo se divide entre los bebotes y el resto.',
    frase: '¡Qué bebote!',
    imagen: 'img/quiz-beboteo.png',
  },
  diva: {
    titulo: 'Moria Diva',
    descripcion:
      'Entrás a cualquier lugar y el lugar cambia de dueño. Tu sola presencia ya es un editorial de moda.',
    frase: 'Yo no necesito hablar: yo entro, y ya está todo dicho.',
    imagen: 'img/quiz-diva.png',
  },
};

function inicializarQuiz() {
  const contenedor = document.getElementById('quiz-contenedor');
  if (!contenedor) return;

  let preguntaActual = 0;
  let puntajes = { llorando: 0, puteando: 0, beboteo: 0, diva: 0 };

  function reiniciarEstado() {
    preguntaActual = 0;
    puntajes = { llorando: 0, puteando: 0, beboteo: 0, diva: 0 };
  }

  function renderPregunta() {
    const pregunta = PREGUNTAS_QUIZ[preguntaActual];

    contenedor.innerHTML = '';

    const progreso = document.createElement('p');
    progreso.className = 'quiz__progreso';
    progreso.textContent = `Pregunta ${preguntaActual + 1} de ${PREGUNTAS_QUIZ.length}`;

    const bloquePregunta = document.createElement('div');
    bloquePregunta.className = 'quiz__pregunta';

    const titulo = document.createElement('h3');
    titulo.textContent = pregunta.texto;

    const listaOpciones = document.createElement('div');
    listaOpciones.className = 'quiz__opciones';

    pregunta.opciones.forEach((opcion) => {
      const boton = document.createElement('button');
      boton.type = 'button';
      boton.className = 'quiz__opcion';
      boton.textContent = opcion.texto;
      boton.addEventListener('click', () => responder(opcion.tipo));
      listaOpciones.appendChild(boton);
    });

    bloquePregunta.appendChild(titulo);
    bloquePregunta.appendChild(listaOpciones);

    contenedor.appendChild(progreso);
    contenedor.appendChild(bloquePregunta);
  }

  function responder(tipo) {
    puntajes[tipo] += 1;
    preguntaActual += 1;

    if (preguntaActual < PREGUNTAS_QUIZ.length) {
      renderPregunta();
    } else {
      renderResultado();
    }
  }

  function calcularGanador() {
    let tipoGanador = 'diva';
    let mejorPuntaje = -1;

    Object.entries(puntajes).forEach(([tipo, puntos]) => {
      if (puntos > mejorPuntaje) {
        mejorPuntaje = puntos;
        tipoGanador = tipo;
      }
    });

    return tipoGanador;
  }

  function renderResultado() {
    const tipoGanador = calcularGanador();
    const resultado = RESULTADOS_QUIZ[tipoGanador];

    contenedor.innerHTML = '';

    const bloque = document.createElement('div');
    bloque.className = 'quiz__resultado';

    const eyebrow = document.createElement('p');
    eyebrow.className = 'eyebrow';
    eyebrow.textContent = 'Tu resultado';

    const imagen = document.createElement('img');
    imagen.className = 'quiz__resultado-imagen';
    imagen.src = resultado.imagen;
    imagen.alt = `Moria Casán en modo ${resultado.titulo.replace('Moria ', '').toLowerCase()}`;

    const titulo = document.createElement('h3');
    titulo.textContent = resultado.titulo;

    const descripcion = document.createElement('p');
    descripcion.textContent = resultado.descripcion;

    const frase = document.createElement('p');
    frase.className = 'quiz__resultado-frase';
    frase.textContent = `"${resultado.frase}"`;

    const botonReiniciar = document.createElement('button');
    botonReiniciar.type = 'button';
    botonReiniciar.className = 'btn-reiniciar';
    botonReiniciar.textContent = 'Volver a hacer el quiz';
    botonReiniciar.addEventListener('click', () => {
      reiniciarEstado();
      renderPregunta();
    });

    bloque.appendChild(eyebrow);
    bloque.appendChild(imagen);
    bloque.appendChild(titulo);
    bloque.appendChild(descripcion);
    bloque.appendChild(frase);
    bloque.appendChild(botonReiniciar);

    contenedor.appendChild(bloque);
  }

  renderPregunta();
}

/* -------------------------------------------------------------
   8. CONTACTO — formulario (sin backend, simula el envío)
------------------------------------------------------------- */
function inicializarContacto() {
  const formulario = document.getElementById('form-contacto');
  if (!formulario) return;

  const mensaje = document.getElementById('form-contacto-mensaje');

  formulario.addEventListener('submit', (evento) => {
    evento.preventDefault();

    if (mensaje) {
      mensaje.textContent = '¡Gracias! Tu mensaje quedó registrado (este sitio es un TP académico, sin envío real de mails).';
    }

    formulario.reset();
  });
}

/* -------------------------------------------------------------
   9. GALERÍA — lightbox con navegación entre personajes
------------------------------------------------------------- */
function inicializarGaleria() {
  const lightbox = document.getElementById('lightbox');
  const botones = document.querySelectorAll('.card-personaje__boton');
  if (!lightbox || !botones.length) return;

  const personajes = Array.from(botones).map((boton) => ({
    nombre: boton.dataset.nombre,
    rol: boton.dataset.rol,
    img: boton.dataset.img,
  }));

  const imagenGrande = document.getElementById('lightbox-img');
  const nombreGrande = document.getElementById('lightbox-nombre');
  const rolGrande = document.getElementById('lightbox-rol');
  const botonCerrar = lightbox.querySelector('.lightbox__cerrar');
  const botonPrev = lightbox.querySelector('.lightbox__flecha--prev');
  const botonNext = lightbox.querySelector('.lightbox__flecha--next');

  let indiceActual = 0;

  function mostrar(indice) {
    // Módulo "positivo" para que dé la vuelta en los dos sentidos.
    indiceActual = (indice + personajes.length) % personajes.length;
    const personaje = personajes[indiceActual];

    imagenGrande.src = personaje.img;
    imagenGrande.alt = personaje.nombre;
    nombreGrande.textContent = personaje.nombre;
    rolGrande.textContent = personaje.rol;
  }

  function abrir(indice) {
    mostrar(indice);
    lightbox.hidden = false;
  }

  function cerrar() {
    lightbox.hidden = true;
  }

  botones.forEach((boton, indice) => {
    boton.addEventListener('click', () => abrir(indice));
  });

  botonCerrar.addEventListener('click', cerrar);
  botonPrev.addEventListener('click', () => mostrar(indiceActual - 1));
  botonNext.addEventListener('click', () => mostrar(indiceActual + 1));

  lightbox.addEventListener('click', (evento) => {
    if (evento.target === lightbox) cerrar();
  });

  document.addEventListener('keydown', (evento) => {
    if (lightbox.hidden) return;
    if (evento.key === 'Escape') cerrar();
    if (evento.key === 'ArrowLeft') mostrar(indiceActual - 1);
    if (evento.key === 'ArrowRight') mostrar(indiceActual + 1);
  });
}

