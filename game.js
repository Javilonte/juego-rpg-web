// Definición de clases para los personajes
class Personaje {
    constructor(nombre, salud, ataque, defensa, velocidad) {
        this.nombre = nombre;
        this.salud = salud;
        this.ataque = ataque;
        this.defensa = defensa;
        this.velocidad = velocidad;
    }

    // Método para atacar a otro personaje
    atacar(objetivo) {
        const daño = this.ataque - objetivo.defensa;
        const dañoInfligido = daño > 0 ? daño : 0;
        objetivo.salud -= dañoInfligido;
        if (objetivo.salud < 0) objetivo.salud = 0;
        actualizarSalud(objetivo);
        mostrarMensaje(`${this.nombre} ataca a ${objetivo.nombre} y causa ${dañoInfligido} puntos de daño.`);

        // Animación de ataque
        if (this === jugador) {
            animarAtaque('jugador');
        } else {
            animarAtaque('oponente');
        }

        // Animación de daño en el objetivo
        if (objetivo === jugador) {
            animarDaño('jugador');
        } else {
            animarDaño('oponente');
        }
    }
}

// Clases específicas para cada tipo de personaje
class IngenieroMecanico extends Personaje {
    constructor() {
        super('Ingeniero Mecánico', 120, 25, 15, 10);
    }

    habilidadEspecial(objetivo) {
        // Fortalece su propia defensa
        this.defensa += 10;
        mostrarMensaje(`${this.nombre} fortalece su defensa.`);
    }
}

class Alquimista extends Personaje {
    constructor() {
        super('Alquimista', 100, 20, 10, 15);
    }

    habilidadEspecial(objetivo) {
        // Cura su propia salud
        const curacion = 30;
        this.salud += curacion;
        if (this.salud > 100) this.salud = 100;
        actualizarSalud(this);
        mostrarMensaje(`${this.nombre} se cura ${curacion} puntos de salud.`);
    }
}

class PilotoDirigibles extends Personaje {
    constructor() {
        super('Piloto de Dirigibles', 90, 22, 12, 20);
    }

    habilidadEspecial(objetivo) {
        // Ataque aéreo que ignora la defensa del oponente
        const daño = this.ataque;
        objetivo.salud -= daño;
        if (objetivo.salud < 0) objetivo.salud = 0;
        actualizarSalud(objetivo);
        mostrarMensaje(`${this.nombre} realiza un ataque aéreo y causa ${daño} puntos de daño.`);

        // Animaciones
        if (this === jugador) {
            animarAtaque('jugador');
        } else {
            animarAtaque('oponente');
        }
        if (objetivo === jugador) {
            animarDaño('jugador');
        } else {
            animarDaño('oponente');
        }
    }
}

// Variables globales
let jugador;
let oponente;

// Función para iniciar el juego
function iniciarJuego() {
    // Ocultar la interfaz de batalla hasta que se seleccione un personaje
    document.getElementById('interfaz-batalla').style.display = 'none';
    document.getElementById('seleccionar-personaje').style.display = 'block';
}

// Función para seleccionar el personaje
function seleccionarPersonaje(seleccion) {
    switch (seleccion) {
        case '1':
            jugador = new IngenieroMecanico();
            break;
        case '2':
            jugador = new Alquimista();
            break;
        case '3':
            jugador = new PilotoDirigibles();
            break;
        default:
            alert('Selección inválida. Se asignará el Ingeniero Mecánico por defecto.');
            jugador = new IngenieroMecanico();
    }

    // Crear un oponente genérico
    oponente = new Personaje('Enemigo Steampunk', 100, 18, 12, 12);

    actualizarInterfaz();
    mostrarMensaje(`¡Comienza la batalla entre ${jugador.nombre} y ${oponente.nombre}!`);

    // Mostrar la interfaz de batalla y ocultar la selección de personaje
    document.getElementById('interfaz-batalla').style.display = 'block';
    document.getElementById('seleccionar-personaje').style.display = 'none';
}

// Funciones para manejar los turnos y acciones
function turnoJugador(accion) {
    if (accion === 'atacar') {
        jugador.atacar(oponente);
    } else if (accion === 'habilidad') {
        jugador.habilidadEspecial(oponente);
    } else if (accion === 'huir') {
        mostrarMensaje(`${jugador.nombre} intenta huir...`);
        // Probabilidad de huir
        if (Math.random() < 0.5) {
            mostrarMensaje('¡Has logrado escapar!');
            deshabilitarBotones();
            return;
        } else {
            mostrarMensaje('No has podido escapar.');
        }
    }

    verificarEstado();
    if (oponente.salud > 0) {
        setTimeout(turnoOponente, 1000);
    }
}

function turnoOponente() {
    mostrarMensaje(`${oponente.nombre} está tomando su turno...`);
    // Oponente realiza un ataque básico
    oponente.atacar(jugador);
    verificarEstado();
}

// Verificar si el juego ha terminado
function verificarEstado() {
    if (jugador.salud <= 0) {
        mostrarMensaje('Has sido derrotado. Fin del juego.');
        deshabilitarBotones();
    } else if (oponente.salud <= 0) {
        mostrarMensaje('¡Has ganado la batalla!');
        deshabilitarBotones();
    }
}

// Actualizar la interfaz con la información actual
function actualizarInterfaz() {
    document.getElementById('nombre-jugador').textContent = jugador.nombre;
    document.getElementById('nombre-oponente').textContent = oponente.nombre;
    actualizarSalud(jugador);
    actualizarSalud(oponente);

    // Establecer la clase del personaje del jugador
    const contenedorJugador = document.getElementById('personaje-jugador');
    contenedorJugador.className = 'personaje-css'; // Resetear clases
    contenedorJugador.classList.add(obtenerClasePersonaje(jugador));

    // Establecer la clase del oponente
    const contenedorOponente = document.getElementById('personaje-oponente');
    contenedorOponente.className = 'personaje-css'; // Resetear clases
    contenedorOponente.classList.add(obtenerClasePersonaje(oponente));
}
// Función para obtener la ruta de la imagen del personaje
function obtenerImagenPersonaje(personaje) {
    switch (personaje.nombre) {
        case 'Ingeniero Mecánico':
            return 'imagenes/ingeniero.png';
        case 'Alquimista':
            return 'imagenes/alquimista.png';
        case 'Piloto de Dirigibles':
            return 'imagenes/piloto.png';
        case 'Enemigo Steampunk':
            return 'imagenes/enemigo.png';
        default:
            return 'imagenes/default.png'; // Imagen por defecto si no coincide
    }
}

// Actualizar la barra de salud del personaje
function actualizarSalud(personaje) {
    const barraSalud = personaje === jugador ? document.getElementById('salud-jugador') : document.getElementById('salud-oponente');
    const porcentajeSalud = (personaje.salud / 100) * 100;
    barraSalud.style.width = `${porcentajeSalud}%`;
}

// Mostrar mensajes en el registro
function mostrarMensaje(mensaje) {
    const registro = document.getElementById('registro-mensajes');
    const nuevoMensaje = document.createElement('p');
    nuevoMensaje.textContent = mensaje;
    registro.appendChild(nuevoMensaje);
    registro.scrollTop = registro.scrollHeight;
}

// Deshabilitar los botones al finalizar el juego
function deshabilitarBotones() {
    document.getElementById('boton-atacar').disabled = true;
    document.getElementById('boton-habilidad').disabled = true;
    document.getElementById('boton-huir').disabled = true;
}

// Animación de ataque
function animarAtaque(quien) {
    const elemento = quien === 'jugador' ? document.getElementById('personaje-jugador') : document.getElementById('personaje-oponente');
    elemento.classList.add('animar-ataque');
    setTimeout(() => {
        elemento.classList.remove('animar-ataque');
    }, 500);
}

// Animación de daño
function animarDaño(quien) {
    const elemento = quien === 'jugador' ? document.getElementById('personaje-jugador') : document.getElementById('personaje-oponente');
    elemento.classList.add('animar-daño');
    setTimeout(() => {
        elemento.classList.remove('animar-daño');
    }, 500);
}

// Manejo de eventos para los botones de acción
document.getElementById('boton-atacar').addEventListener('click', () => turnoJugador('atacar'));
document.getElementById('boton-habilidad').addEventListener('click', () => turnoJugador('habilidad'));
document.getElementById('boton-huir').addEventListener('click', () => turnoJugador('huir'));

function obtenerClasePersonaje(personaje) {
    switch (personaje.nombre) {
        case 'Ingeniero Mecánico':
            return 'ingeniero';
        case 'Alquimista':
            return 'alquimista';
        case 'Piloto de Dirigibles':
            return 'piloto';
        case 'Enemigo Steampunk':
            return 'enemigo';
        default:
            return '';
    }
}
// Iniciar el juego al cargar la página
window.onload = iniciarJuego;
