// ============================================
// POKÉEDUCACIÓN - Pokémon completos vía PokéAPI
// ============================================

// ===== FONDO ANIMADO CON CANVAS =====
(function iniciarFondoCanvas() {
    const canvas = document.getElementById('lienzoFondo');
    const ctx = canvas.getContext('2d');
    let w, h, mouseX = 0, mouseY = 0;

    function redimensionar() {
        w = canvas.width = window.innerWidth;
        h = canvas.height = window.innerHeight;
    }
    redimensionar();
    window.addEventListener('resize', redimensionar);
    window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

    const colores = ['#FFDE00', '#CC0000', '#3B4CCA', '#6890F0', '#F08030', '#78C850', '#F85888', '#7038F8', '#98D8D8', '#FF6B6B'];
    const particulas = [];
    const CANTIDAD = 120;
    const conexiones = [];

    for (let i = 0; i < CANTIDAD; i++) {
        const p = {
            x: Math.random() * w, y: Math.random() * h,
            r: Math.random() * 3.5 + 1,
            dx: (Math.random() - 0.5) * 0.8, dy: (Math.random() - 0.5) * 0.8,
            color: colores[Math.floor(Math.random() * colores.length)],
            opacidad: Math.random() * 0.5 + 0.1,
            pulsar: Math.random() * Math.PI * 2,
            velocidadPulso: Math.random() * 0.03 + 0.005,
            forma: Math.random() > 0.6 ? 'estrella' : 'circulo',
            tamano: Math.random() * 2.5 + 0.5,
            edad: 0,
        };
        particulas.push(p);
    }

    const pokebolasFlotantes = [];
    for (let i = 0; i < 8; i++) {
        const size = Math.random() * 25 + 12;
        pokebolasFlotantes.push({
            x: Math.random() * w, y: Math.random() * h, size,
            dx: (Math.random() - 0.5) * 0.4, dy: -Math.random() * 0.4 - 0.05,
            rotacion: 0, velocidadRot: (Math.random() - 0.5) * 0.015,
            opacidad: Math.random() * 0.1 + 0.02,
            pulsar: Math.random() * Math.PI * 2,
        });
    }

    function dibujarPokebola(x, y, size, rot, opacidad, pulso) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rot);
        const escala = 1 + 0.05 * Math.sin(pulso);
        ctx.scale(escala, escala);
        ctx.globalAlpha = opacidad;
        ctx.shadowColor = 'rgba(255,222,0,0.15)';
        ctx.shadowBlur = 15;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.fillStyle = '#CC0000';
        ctx.fill();
        ctx.beginPath();
        ctx.rect(-size, 0, size * 2, size);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.28, 0, Math.PI * 2);
        ctx.fillStyle = '#555';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.14, 0, Math.PI * 2);
        ctx.fillStyle = '#f0f0f0';
        ctx.fill();
        ctx.strokeStyle = '#444';
        ctx.lineWidth = size * 0.07;
        ctx.beginPath();
        ctx.arc(0, 0, size, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(-size, 0);
        ctx.lineTo(size, 0);
        ctx.stroke();
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    function dibujarParticula(p, opacidad) {
        ctx.save();
        ctx.globalAlpha = opacidad;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.r * 3;
        ctx.fillStyle = p.color;
        if (p.forma === 'circulo') {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * p.tamano, 0, Math.PI * 2);
            ctx.fill();
        } else {
            ctx.translate(p.x, p.y);
            ctx.rotate(p.pulsar * 0.5);
            ctx.beginPath();
            for (let j = 0; j < 4; j++) {
                const a = (j / 4) * Math.PI * 2 - Math.PI / 2;
                const px = Math.cos(a) * p.r * 2.5 * p.tamano;
                const py = Math.sin(a) * p.r * 2.5 * p.tamano;
                if (j === 0) ctx.moveTo(px, py);
                else ctx.lineTo(px, py);
            }
            ctx.closePath();
            ctx.fill();
        }
        ctx.shadowBlur = 0;
        ctx.restore();
    }

    function animar() {
        ctx.clearRect(0, 0, w, h);

        // Líneas entre partículas cercanas
        for (let i = 0; i < particulas.length; i++) {
            for (let j = i + 1; j < particulas.length; j++) {
                const dx = particulas[i].x - particulas[j].x;
                const dy = particulas[i].y - particulas[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.globalAlpha = (1 - dist / 120) * 0.08;
                    ctx.strokeStyle = particulas[i].color;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particulas[i].x, particulas[i].y);
                    ctx.lineTo(particulas[j].x, particulas[j].y);
                    ctx.stroke();
                }
            }
        }

        particulas.forEach(p => {
            p.edad++;
            const mouseDist = Math.sqrt((p.x - mouseX) ** 2 + (p.y - mouseY) ** 2);
            if (mouseDist < 200 && mouseX > 0) {
                const fuerza = (1 - mouseDist / 200) * 0.5;
                p.dx += (p.x - mouseX) / mouseDist * fuerza * 0.1;
                p.dy += (p.y - mouseY) / mouseDist * fuerza * 0.1;
            }
            p.dx += (Math.random() - 0.5) * 0.02;
            p.dy += (Math.random() - 0.5) * 0.02;
            const maxVel = 1.5;
            if (Math.abs(p.dx) > maxVel) p.dx = Math.sign(p.dx) * maxVel;
            if (Math.abs(p.dy) > maxVel) p.dy = Math.sign(p.dy) * maxVel;
            p.x += p.dx;
            p.y += p.dy;
            p.pulsar += p.velocidadPulso;
            if (p.x < -20) { p.x = w + 20; p.y = Math.random() * h; }
            if (p.x > w + 20) { p.x = -20; p.y = Math.random() * h; }
            if (p.y < -20) { p.y = h + 20; p.x = Math.random() * w; }
            if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
            const opacidadActual = p.opacidad * (0.6 + 0.4 * Math.sin(p.pulsar));
            dibujarParticula(p, opacidadActual);
        });

        pokebolasFlotantes.forEach(pb => {
            pb.pulsar += 0.02;
            pb.x += pb.dx;
            pb.y += pb.dy;
            pb.rotacion += pb.velocidadRot;
            if (pb.x < -60) pb.x = w + 60;
            if (pb.x > w + 60) pb.x = -60;
            if (pb.y < -60) pb.y = h + 60;
            if (pb.y > h + 60) pb.y = -60;
            dibujarPokebola(pb.x, pb.y, pb.size, pb.rotacion, pb.opacidad, pb.pulsar);
        });

        ctx.globalAlpha = 1;
        requestAnimationFrame(animar);
    }
    animar();
})();

// ===== PANTALLA DE BIENVENIDA =====
(function iniciarBienvenida() {
    const overlay = document.getElementById('welcomeOverlay');
    const textoEl = document.getElementById('welcomeTexto');
    const instruccion = document.getElementById('welcomeInstruccion');
    const mensajes = [
        '¡Hola! Soy Pikachu. ¿Estás listo para tu aventura?',
        'Aquí encontrarás todos los Pokémon de Kanto...',
        '¡Aprende sobre sus tipos, historias y evoluciones!',
        'Haz clic para comenzar. ¡Te espero! ⚡'
    ];
    let msgIndex = 0;
    let charIndex = 0;
    let escribiendo = false;
    let intervalo;

    function escribirMensaje() {
        const msg = mensajes[msgIndex];
        charIndex = 0;
        textoEl.textContent = '';
        escribiendo = true;
        clearInterval(intervalo);
        intervalo = setInterval(() => {
            if (charIndex < msg.length) {
                textoEl.textContent += msg[charIndex];
                charIndex++;
            } else {
                clearInterval(intervalo);
                escribiendo = false;
                setTimeout(() => {
                    msgIndex = (msgIndex + 1) % mensajes.length;
                    if (msgIndex === 0) msgIndex = 1;
                    escribirMensaje();
                }, 2500);
            }
        }, 35);
    }

    escribirMensaje();

    function cerrarBienvenida() {
        overlay.classList.add('oculto');
        clearInterval(intervalo);
        document.getElementById('btnMusica').classList.remove('oculto');
        setTimeout(() => overlay.style.display = 'none', 800);
    }

    overlay.addEventListener('click', cerrarBienvenida);
    document.addEventListener('keydown', function enterHandler(e) {
        if (e.key === 'Enter' && !overlay.classList.contains('oculto')) {
            cerrarBienvenida();
            document.removeEventListener('keydown', enterHandler);
        }
    });
})();

// ===== MÚSICA POKÉMON (Audio directo) =====
(function crearMusica() {
    const btn = document.getElementById('btnMusica');
    let tocando = false;

    const audio = new Audio();
    audio.volume = 0.4;
    audio.loop = true;

    const fuentes = [
        'https://www.televisiontunes.com/uploads/audio/Pokemon.mp3',
        'http://www.topofarmer.com/wp-content/uploads/2011/05/1-Hazte-Con-Todos.mp3',
    ];

    let intentoActual = 0;

    function cargarSiguienteFuente() {
        if (intentoActual >= fuentes.length) {
            btn.textContent = '❌';
            btn.title = 'No se pudo cargar la música';
            return;
        }
        audio.src = fuentes[intentoActual];
        audio.load();
    }

    audio.addEventListener('error', function() {
        intentoActual++;
        cargarSiguienteFuente();
    });

    cargarSiguienteFuente();

    btn.addEventListener('click', function iniciar() {
        if (tocando) {
            audio.pause();
            tocando = false;
            btn.textContent = '🔇';
            btn.classList.remove('activo');
        } else {
            if (audio.readyState === 0 && intentoActual < fuentes.length) {
                // Todavía cargando, activar reproducción
            }
            audio.play().then(() => {
                tocando = true;
                btn.textContent = '🔊';
                btn.classList.add('activo');
            }).catch(function() {
                btn.textContent = '❌';
                btn.title = 'Error al reproducir';
            });
        }
    });
})();

// ===== ANIMACIÓN DE CAPTURA =====
function animarCaptura(p, callback) {
    const overlay = document.getElementById('capturaOverlay');
    const pokebola = document.getElementById('capturaPokebola');
    const pokemonDiv = document.getElementById('capturaPokemon');
    const sprite = document.getElementById('capturaSprite');
    const nombre = document.getElementById('capturaNombre');
    const estrellas = document.getElementById('capturaEstrellas');

    sprite.src = p.sprite;
    nombre.textContent = p.nombre;

    overlay.classList.remove('oculto');
    pokebola.className = 'captura-pokebola';
    pokemonDiv.classList.add('oculto');
    estrellas.style.opacity = '0';

    setTimeout(() => {
        pokebola.classList.add('abriendo');
        setTimeout(() => {
            pokebola.style.display = 'none';
            pokemonDiv.classList.remove('oculto');
            estrellas.style.opacity = '';
            setTimeout(() => {
                overlay.classList.add('oculto');
                pokebola.style.display = '';
                pokebola.className = 'captura-pokebola';
                pokemonDiv.classList.add('oculto');
                if (callback) callback();
            }, 1200);
        }, 500);
    }, 1300);
}

// Sobreescribir abrirModal para incluir animación
const abrirModalOriginal = null;

// ===== NAVEGACIÓN =====
document.querySelectorAll('.btn-nav').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-nav').forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        document.querySelectorAll('.seccion').forEach(s => s.classList.remove('visible'));
        document.getElementById('seccion-' + btn.dataset.seccion).classList.add('visible');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

// ============================================
// MAPA DE TIPOS (hardcoded)
// ============================================
const TIPOS = ['normal', 'fuego', 'agua', 'planta', 'electrico', 'hielo', 'lucha', 'veneno', 'tierra', 'volador', 'psiquico', 'roca', 'fantasma', 'dragon', 'siniestro', 'hada', 'acero', 'bicho'];

const EFECTIVIDAD = {
    normal:   { roca: 0.5, fantasma: 0, acero: 0.5 },
    fuego:    { fuego: 0.5, agua: 0.5, planta: 2, hielo: 2, roca: 0.5, dragon: 0.5, bicho: 2, acero: 2, hada: 0.5 },
    agua:     { fuego: 2, agua: 0.5, planta: 0.5, tierra: 2, roca: 2, dragon: 0.5 },
    planta:   { fuego: 0.5, agua: 2, planta: 0.5, veneno: 0.5, tierra: 2, volador: 0.5, bicho: 0.5, roca: 2, dragon: 0.5 },
    electrico: { agua: 2, planta: 0.5, electrico: 0.5, tierra: 0, volador: 2, dragon: 0.5 },
    hielo:    { fuego: 0.5, agua: 0.5, planta: 2, hielo: 0.5, tierra: 2, volador: 2, dragon: 2, acero: 0.5, hada: 0.5 },
    lucha:    { normal: 2, hielo: 2, veneno: 0.5, volador: 0.5, psiquico: 0.5, bicho: 0.5, roca: 2, fantasma: 0, siniestro: 2, acero: 2, hada: 0.5 },
    veneno:   { planta: 2, veneno: 0.5, tierra: 0.5, roca: 0.5, fantasma: 0.5, acero: 0, hada: 2 },
    tierra:   { fuego: 2, planta: 0.5, electrico: 2, volador: 0, bicho: 0.5, roca: 2, veneno: 2, acero: 2 },
    volador:  { planta: 2, electrico: 0.5, lucha: 2, bicho: 2, roca: 0.5, acero: 0.5 },
    psiquico: { lucha: 2, veneno: 2, psiquico: 0.5, siniestro: 0, acero: 0.5 },
    roca:     { fuego: 2, agua: 0.5, planta: 0.5, lucha: 0.5, tierra: 0.5, volador: 2, bicho: 2, hielo: 2, acero: 0.5 },
    fantasma: { normal: 0, psiquico: 2, fantasma: 2, siniestro: 0.5, bicho: 0.5, veneno: 0.5 },
    dragon:   { dragon: 2, acero: 0.5, hada: 0 },
    siniestro: { lucha: 0.5, psiquico: 2, fantasma: 2, siniestro: 0.5, hada: 0.5 },
    hada:     { fuego: 0.5, veneno: 0.5, lucha: 2, dragon: 2, siniestro: 2, acero: 0.5 },
    acero:    { fuego: 0.5, agua: 0.5, electrico: 0.5, hielo: 2, roca: 2, acero: 0.5, hada: 2 },
    bicho:    { fuego: 0.5, planta: 2, lucha: 0.5, veneno: 0.5, volador: 0.5, psiquico: 2, fantasma: 0.5, siniestro: 2, acero: 0.5, hada: 0.5 },
};

function obtenerEfectividad(atacante, defensor) {
    const mapa = EFECTIVIDAD[atacante];
    if (!mapa) return 1;
    return mapa[defensor] ?? 1;
}

function construirTablaTipos() {
    const tbody = document.getElementById('cuerpoTablaTipos');
    tbody.innerHTML = '';
    TIPOS.forEach(atacante => {
        const fila = document.createElement('tr');
        const th = document.createElement('th');
        th.className = 'tipo-tag tipo-' + atacante;
        th.textContent = atacante.charAt(0).toUpperCase() + atacante.slice(1);
        fila.appendChild(th);
        TIPOS.forEach(defensor => {
            const td = document.createElement('td');
            const val = obtenerEfectividad(atacante, defensor);
            if (val === 2) { td.className = 'celda-tipo celda-super-eficaz'; td.textContent = '×2'; }
            else if (val === 0.5) { td.className = 'celda-tipo celda-poco-eficaz'; td.textContent = '½'; }
            else if (val === 0) { td.className = 'celda-tipo celda-inmune'; td.textContent = '0'; }
            else { td.className = 'celda-tipo celda-normal'; td.textContent = '—'; }
            td.title = atacante.charAt(0).toUpperCase() + atacante.slice(1) + ' vs ' + defensor.charAt(0).toUpperCase() + defensor.slice(1);
            fila.appendChild(td);
        });
        tbody.appendChild(fila);
    });
}
construirTablaTipos();

// ============================================
// TRADUCCIONES DE TIPOS
// ============================================
const TRADUCCION_TIPO = {
    normal: 'Normal', fire: 'Fuego', water: 'Agua', grass: 'Planta',
    electric: 'Eléctrico', ice: 'Hielo', fighting: 'Lucha', poison: 'Veneno',
    ground: 'Tierra', flying: 'Volador', psychic: 'Psíquico', rock: 'Roca',
    ghost: 'Fantasma', dragon: 'Dragón', dark: 'Siniestro', fairy: 'Hada',
    steel: 'Acero', bug: 'Bicho'
};
const MAPA_TIPO_INGLES = {
    normal: 'normal', fire: 'fuego', water: 'agua', grass: 'planta',
    electric: 'electrico', ice: 'hielo', fighting: 'lucha', poison: 'veneno',
    ground: 'tierra', flying: 'volador', psychic: 'psiquico', rock: 'roca',
    ghost: 'fantasma', dragon: 'dragon', dark: 'siniestro', fairy: 'hada',
    steel: 'acero', bug: 'bicho'
};

// ============================================
// POKÉAPI - Cargar todos los Pokémon
// ============================================
let DATOS_POKEMON = [];
let pokemonCargados = false;
const MEGA_EVOLUCIONES = [];

const NATURALEZA_DATOS = {
    fuego: { icono: '🔥', desc: 'Los Pokémon de Fuego son apasionados y enérgicos. Su espíritu ardiente los impulsa a enfrentar cualquier desafío con valentía.' },
    agua: { icono: '💧', desc: 'Los Pokémon de Agua son adaptables y fluidos. Tranquilos pero poderosos, se sienten en casa tanto en tierra como en el mar.' },
    planta: { icono: '🌱', desc: 'Los Pokémon de Planta están conectados con la naturaleza. Son pacientes y resistentes, creciendo con el tiempo.' },
    electrico: { icono: '⚡', desc: 'Los Pokémon Eléctricos son veloces y vibrantes. Su energía es contagiosa y siempre están listos para la acción.' },
    psiquico: { icono: '🔮', desc: 'Los Pokémon Psíquicos poseen mentes poderosas. Son inteligentes, calculadores y guardan secretos ancestrales.' },
    fantasma: { icono: '👻', desc: 'Los Pokémon Fantasma pertenecen al mundo espiritual. Son enigmáticos y conectan el mundo de los vivos con el más allá.' },
    dragon: { icono: '🐉', desc: 'Los Pokémon Dragón son criaturas legendarias de poder inimaginable. Solo los mejores entrenadores logran domarlos.' },
    lucha: { icono: '🥊', desc: 'Los Pokémon de Lucha son guerreros natos. Su disciplina y determinación los convierte en combatientes excepcionales.' },
    normal: { icono: '⬜', desc: 'Los Pokémon Normales son versátiles y equilibrados. Su simplicidad oculta una gran adaptabilidad.' },
    hielo: { icono: '❄️', desc: 'Los Pokémon de Hielo son seres de belleza gélida. Son pacientes y estratégicos.' },
    tierra: { icono: '🏜️', desc: 'Los Pokémon de Tierra son sólidos como el suelo. Son protectores natos con fuerza elemental.' },
    volador: { icono: '🕊️', desc: 'Los Pokémon Voladores son libres como el viento. Aman las alturas y tienen una perspectiva única.' },
    veneno: { icono: '☠️', desc: 'Los Pokémon Veneno son peligrosos pero fascinantes. Su naturaleza tóxica los hace temidos.' },
    roca: { icono: '🪨', desc: 'Los Pokémon Roca son duros como las montañas. Su resistencia los convierte en defensas impenetrables.' },
    bicho: { icono: '🐛', desc: 'Los Pokémon Bicho son increíblemente adaptables. Muchos evolucionan en formas sorprendentes.' },
    siniestro: { icono: '😈', desc: 'Los Pokémon Siniestro son astutos y misteriosos. Su naturaleza oscura los hace impredecibles.' },
    hada: { icono: '✨', desc: 'Los Pokémon Hada son criaturas mágicas. Su energía pura puede sanar y proteger.' },
    acero: { icono: '⚙️', desc: 'Los Pokémon Acero son máquinas de batalla vivientes. Su defensa es legendaria.' },
};

async function cargarPokemon() {
    try {
        document.querySelectorAll('.seccion').forEach(s => s.style.opacity = '0.5');
        const loadingMsg = document.createElement('div');
        loadingMsg.className = 'loading-msg';
        loadingMsg.innerHTML = '<div class="pokebola-cargando"></div><p>Cargando Pokémon de Kanto...</p>';
        document.querySelector('.contenido').prepend(loadingMsg);

        const listaResp = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
        const listaData = await listaResp.json();
        const urls = listaData.results.map(r => r.url);

        const BATCH_SIZE = 20;
        const pokemonData = [];
        for (let i = 0; i < urls.length; i += BATCH_SIZE) {
            const batch = urls.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(url =>
                fetch(url).then(r => r.json())
            ));
            pokemonData.push(...results);
            loadingMsg.innerHTML = `<div class="pokebola-cargando"></div><p>Cargando Pokémon... ${Math.min(i + BATCH_SIZE, 151)}/151</p>`;
        }

        loadingMsg.innerHTML = `<div class="pokebola-cargando"></div><p>Obteniendo datos de especie...</p>`;

        const speciesData = [];
        for (let i = 0; i < pokemonData.length; i += BATCH_SIZE) {
            const batch = pokemonData.slice(i, i + BATCH_SIZE);
            const results = await Promise.all(batch.map(p =>
                fetch(p.species.url).then(r => r.json())
            ));
            speciesData.push(...results);
        }

        loadingMsg.remove();
        document.querySelectorAll('.seccion').forEach(s => s.style.opacity = '');

        DATOS_POKEMON = pokemonData.map((p, idx) => {
            const species = speciesData[idx];
            const tiposEsp = p.types.map(t => {
                const eng = t.type.name;
                return MAPA_TIPO_INGLES[eng] || eng;
            });
            const genusObj = species.genera.find(g => g.language.name === 'es') || species.genera[0];
            const naturaleza = genusObj ? genusObj.genus.replace('Pokémon ', '') : 'Desconocido';
            const storyEntry = species.flavor_text_entries.find(f => f.language.name === 'es')
                || species.flavor_text_entries.find(f => f.language.name === 'en')
                || species.flavor_text_entries[0];
            let historia = storyEntry ? storyEntry.flavor_text.replace(/[\n\f]/g, ' ') : 'No hay información disponible.';
            const nombreEsp = species.names.find(n => n.language.name === 'es');
            const nombreFinal = nombreEsp ? nombreEsp.name : p.name.charAt(0).toUpperCase() + p.name.slice(1);

            return {
                id: p.id,
                nombre: nombreFinal,
                nombreIngles: p.name,
                tipos: tiposEsp,
                stats: { hp: p.stats[0].base_stat, atk: p.stats[1].base_stat, def: p.stats[2].base_stat, spatk: p.stats[3].base_stat, spdef: p.stats[4].base_stat, spd: p.stats[5].base_stat },
                sprite: p.sprites.other?.['official-artwork']?.front_default
                    || p.sprites.front_default
                    || `https://img.pokemondb.net/sprites/scarlet-violet/normal/${p.name}.png`,
                naturaleza: naturaleza,
                historia: historia,
                speciesUrl: p.species.url,
            };
        });

        // Agregar megaevoluciones hardcodeadas
        const MEGAS = [
            { id: '10003', base: 3, nombre: 'Mega Venusaur', tipos: ['planta', 'veneno'], stats: { hp: 80, atk: 100, def: 123, spatk: 122, spdef: 120, spd: 80 }, naturaleza: 'Mega Semilla', historia: 'Al megaevolucionar, la flor de Venusaur crece descomunalmente. Aparece un gran lirio en su cabeza y puede controlar la vegetación de kilómetros.' },
            { id: '10006x', base: 6, nombre: 'Mega Charizard X', tipos: ['fuego', 'dragon'], stats: { hp: 78, atk: 130, def: 111, spatk: 130, spdef: 85, spd: 100 }, naturaleza: 'Mega Dragón', historia: 'Charizard se transforma en un dragón negro con llamas azules. Su poder físico se incrementa drásticamente y su aliento funde el acero.' },
            { id: '10006y', base: 6, nombre: 'Mega Charizard Y', tipos: ['fuego', 'volador'], stats: { hp: 78, atk: 104, def: 78, spatk: 159, spdef: 115, spd: 100 }, naturaleza: 'Mega Llama', historia: 'Grandes alas con bordes azules y una llama más intensa. Crea tormentas de fuego y vuela a velocidades que desafían la gravedad.' },
            { id: '10009', base: 9, nombre: 'Mega Blastoise', tipos: ['agua'], stats: { hp: 79, atk: 105, def: 120, spatk: 135, spdef: 115, spd: 78 }, naturaleza: 'Mega Armadura', historia: 'Un cañón central gigante emerge de su caparazón. Su hidrocañón puede perforar montañas enteras.' },
            { id: '10094', base: 94, nombre: 'Mega Gengar', tipos: ['fantasma', 'veneno'], stats: { hp: 60, atk: 65, def: 80, spatk: 170, spdef: 95, spd: 130 }, naturaleza: 'Mega Sombra', historia: 'Gengar se vuelve más grande y tenebroso, emergiendo del suelo como una aparición espectral. Atrapa almas en su sombra.' },
            { id: '10130', base: 130, nombre: 'Mega Gyarados', tipos: ['agua', 'siniestro'], stats: { hp: 95, atk: 155, def: 109, spatk: 70, spdef: 130, spd: 81 }, naturaleza: 'Mega Atrocidad', historia: 'Gyarados se vuelve más oscuro con ojos carmesí. Las nubes de tormenta lo siguen y su rugido desencadena tsunamis.' },
            { id: '10065', base: 65, nombre: 'Mega Alakazam', tipos: ['psiquico'], stats: { hp: 55, atk: 50, def: 65, spatk: 175, spdef: 105, spd: 150 }, naturaleza: 'Mega Psíquico', historia: 'Alakazam flota en el aire. Cinco cucharas flotan a su controladas por su mente. Procesa información como supercomputadora.' },
            { id: '10448', base: 448, nombre: 'Mega Lucario', tipos: ['lucha', 'acero'], stats: { hp: 70, atk: 145, def: 88, spatk: 140, spdef: 70, spd: 112 }, naturaleza: 'Mega Aura', historia: 'Mega Lucario desata todo el poder del aura. Siente a sus enemigos antes de que ataquen y contraataca al instante.' },
            { id: '10248', base: 248, nombre: 'Mega Tyranitar', tipos: ['roca', 'siniestro'], stats: { hp: 100, atk: 164, def: 150, spatk: 95, spdef: 120, spd: 71 }, naturaleza: 'Mega Armadura', historia: 'Se cubre de una armadura de roca volcánica indestructible. Provoca terremotos al caminar.' },
            { id: '10376', base: 376, nombre: 'Mega Metagross', tipos: ['acero', 'psiquico'], stats: { hp: 80, atk: 145, def: 150, spatk: 105, spdef: 110, spd: 110 }, naturaleza: 'Mega Hierro', historia: 'Sus cuatro brazos forman una X y sus ojos brillan carmesí. Calcula variables de batalla en segundos.' },
            { id: '10445', base: 445, nombre: 'Mega Garchomp', tipos: ['dragon', 'tierra'], stats: { hp: 108, atk: 170, def: 115, spatk: 120, spdef: 95, spd: 92 }, naturaleza: 'Mega Maquinación', historia: 'Sus aletas se vuelven cuchillas retráctiles. Sus ojos se vuelven rojos y su sed de batalla se intensifica.' },
            { id: '10150x', base: 150, nombre: 'Mega Mewtwo X', tipos: ['psiquico', 'lucha'], stats: { hp: 106, atk: 190, def: 100, spatk: 154, spdef: 100, spd: 130 }, naturaleza: 'Mega Psíquico', historia: 'Mewtwo combina poder psíquico con fuerza bruta. Se teletransporta antes de que sus oponentes parpadeen.' },
            { id: '10150y', base: 150, nombre: 'Mega Mewtwo Y', tipos: ['psiquico'], stats: { hp: 106, atk: 150, def: 70, spatk: 194, spdef: 120, spd: 140 }, naturaleza: 'Mega Psíquico', historia: 'Su poder mental se multiplica. Levanta montañas con su mente y crea tormentas psíquicas devastadoras.' },
        ];

        MEGAS.forEach(m => {
            const base = DATOS_POKEMON.find(p => p.id === m.base);
            const sprite = base ? base.sprite : `https://img.pokemondb.net/sprites/scarlet-violet/normal/${m.nombre.toLowerCase().replace(/ /g, '-')}.png`;
            DATOS_POKEMON.push({
                id: m.id,
                nombre: m.nombre,
                tipos: m.tipos,
                stats: m.stats,
                sprite: sprite,
                naturaleza: m.naturaleza,
                historia: m.historia,
                esMega: true,
            });
            MEGA_EVOLUCIONES.push(m);
        });

        pokemonCargados = true;
        inicializarUI();
    } catch (err) {
        console.error('Error cargando Pokémon:', err);
        document.querySelector('.contenido').innerHTML =
            '<div style="text-align:center;padding:60px;color:#ff6666;"><h2>Error al cargar los Pokémon</h2><p>Verifica tu conexión a internet.</p></div>';
    }
}

// ============================================
// INICIALIZAR UI
// ============================================
function inicializarUI() {
    mostrarPokedex(DATOS_POKEMON);
    filtrarNaturaleza('todos');
    mostrarHistorias(DATOS_POKEMON);
    construirEvoluciones();
}

// ===== MODAL =====
const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');

function formatearNumeroPokemon(p) {
    if (p.esMega || typeof p.id === 'string') return 'MEGA';
    return '#' + String(p.id).padStart(3, '0');
}

let capturaVista = false;

function mostrarModalDirecto(p) {
    const s = p.stats;
    const maxStat = 255;
    modalBody.innerHTML = `
        <div class="modal-body">
            <img class="modal-sprite" src="${p.sprite}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2260%22>❓</text></svg>'">
            <div class="modal-numero">${formatearNumeroPokemon(p)}</div>
            <div class="modal-nombre">${p.nombre}</div>
            <div class="modal-tipos">${p.tipos.map(t => `<span class="tipo-mini tipo-${t}">${t}</span>`).join('')}</div>
            <div class="modal-stats">
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">❤️ HP</span><span class="stat-valor">${s.hp}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.hp/maxStat*100)}%"></div></div>
                </div>
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">⚔️ Ataque</span><span class="stat-valor">${s.atk}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.atk/maxStat*100)}%"></div></div>
                </div>
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">🛡️ Defensa</span><span class="stat-valor">${s.def}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.def/maxStat*100)}%"></div></div>
                </div>
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">🔮 At.Esp.</span><span class="stat-valor">${s.spatk}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.spatk/maxStat*100)}%"></div></div>
                </div>
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">✨ Def.Esp.</span><span class="stat-valor">${s.spdef}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.spdef/maxStat*100)}%"></div></div>
                </div>
                <div class="modal-stat">
                    <div class="stat-header"><span class="stat-label">💨 Velocidad</span><span class="stat-valor">${s.spd}</span></div>
                    <div class="stat-barra-contenedor"><div class="stat-barra" style="width:${(s.spd/maxStat*100)}%"></div></div>
                </div>
            </div>
            <div class="modal-naturaleza">🌿 Naturaleza: ${p.naturaleza || 'Desconocida'}</div>
            <div class="modal-historia">
                <div class="modal-historia-titulo">📜 Leyenda Pokémon</div>
                ${p.historia || 'No hay información disponible.'}
            </div>
        </div>
    `;
    modalOverlay.classList.remove('oculto');
    document.body.style.overflow = 'hidden';
    // Animate stat bars after render
    const bars = modalBody.querySelectorAll('.stat-barra');
    bars.forEach(bar => {
        const targetW = bar.dataset.target || bar.style.width;
        bar.style.width = '0';
        bar.dataset.target = targetW;
    });
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            bars.forEach(bar => {
                bar.style.width = bar.dataset.target;
            });
        });
    });
}

function abrirModal(p) {
    if (!capturaVista) {
        capturaVista = true;
        animarCaptura(p, () => mostrarModalDirecto(p));
    } else {
        mostrarModalDirecto(p);
    }
}

document.getElementById('modalCerrar').addEventListener('click', cerrarModal);
modalOverlay.addEventListener('click', (e) => { if (e.target === e.currentTarget) cerrarModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') cerrarModal(); });
function cerrarModal() {
    modalOverlay.classList.add('oculto');
    document.body.style.overflow = '';
}

// ===== POKÉDEX =====
const pokedexGrid = document.getElementById('pokedexGrid');
const buscador = document.getElementById('buscadorPokemon');
const btnBuscar = document.getElementById('btnBuscar');

function mostrarPokedex(lista) {
    pokedexGrid.innerHTML = '';
    lista.forEach(p => {
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-pokemon';
        tarjeta.innerHTML = `
            <span class="numero-pokemon">${formatearNumeroPokemon(p)}</span>
            <img src="${p.sprite}" alt="${p.nombre}" loading="lazy" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2260%22>❓</text></svg>'">
            <div class="nombre-pokemon">${p.nombre}</div>
            <div class="tipos-pokemon">${p.tipos.map(t => `<span class="tipo-mini tipo-${t}">${t}</span>`).join('')}</div>
            <div class="stats-pokemon">
                <span>❤️ ${p.stats.hp}</span>
                <span>⚔️ ${p.stats.atk}</span>
                <span>🛡️ ${p.stats.def}</span>
                <span>💨 ${p.stats.spd}</span>
            </div>
        `;
        tarjeta.addEventListener('click', () => abrirModal(p));
        pokedexGrid.appendChild(tarjeta);
    });
}

function filtrarPokemon() {
    const q = buscador.value.toLowerCase().trim();
    if (!q) { mostrarPokedex(DATOS_POKEMON); return; }
    const filtrados = DATOS_POKEMON.filter(p =>
        p.nombre.toLowerCase().includes(q) ||
        String(p.id) === q ||
        p.tipos.some(t => t.includes(q))
    );
    if (filtrados.length === 0) {
        pokedexGrid.innerHTML = '<div class="sin-resultados"><span class="icono">🔍</span>No se encontraron Pokémon para "<strong>' + q + '</strong>"</div>';
    } else {
        mostrarPokedex(filtrados);
    }
}

buscador.addEventListener('input', filtrarPokemon);
btnBuscar.addEventListener('click', function(e) {
    e.preventDefault();
    filtrarPokemon();
});

// ===== NATURALEZA =====
const naturalezaGrid = document.getElementById('naturalezaGrid');
const botonesNaturaleza = document.querySelectorAll('.btn-naturaleza');

function filtrarNaturaleza(tipo) {
    naturalezaGrid.innerHTML = '';
    const tiposAMostrar = tipo === 'todos' ? Object.keys(NATURALEZA_DATOS) : [tipo];

    tiposAMostrar.forEach(t => {
        const info = NATURALEZA_DATOS[t];
        const pokemones = DATOS_POKEMON.filter(p => !p.esMega && p.tipos[0] === t);
        if (pokemones.length === 0) return;

        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-naturaleza';
        const miniPokemones = pokemones.slice(0, 6);
        tarjeta.innerHTML = `
            <div class="naturaleza-icono">${info.icono}</div>
            <h3>${t.charAt(0).toUpperCase() + t.slice(1)}</h3>
            <p class="naturaleza-descripcion">${info.desc}</p>
            <div class="naturaleza-pokemones">
                ${miniPokemones.map(p => `
                    <div class="naturaleza-pokemon-mini" data-pokemon-id="${p.id}">
                        <img src="${p.sprite}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2260%22>❓</text></svg>'">
                        <div>${p.nombre}</div>
                    </div>
                `).join('')}
                ${pokemones.length > 6 ? `<div class="naturaleza-pokemon-mini" style="color:rgba(255,255,255,0.4);font-size:0.85em">+${pokemones.length - 6} más</div>` : ''}
            </div>
        `;
        tarjeta.querySelectorAll('.naturaleza-pokemon-mini[data-pokemon-id]').forEach(el => {
            const id = el.dataset.pokemonId;
            const poke = DATOS_POKEMON.find(p => String(p.id) === id);
            if (poke) {
                el.style.cursor = 'pointer';
                el.addEventListener('click', () => abrirModal(poke));
            }
        });
        naturalezaGrid.appendChild(tarjeta);
    });
}

botonesNaturaleza.forEach(btn => {
    btn.addEventListener('click', () => {
        botonesNaturaleza.forEach(b => b.classList.remove('activo'));
        btn.classList.add('activo');
        filtrarNaturaleza(btn.dataset.tipo);
    });
});

// ===== HISTORIAS =====
const historiasGrid = document.getElementById('historiasGrid');
const buscadorHistorias = document.getElementById('buscadorHistorias');

function mostrarHistorias(lista) {
    historiasGrid.innerHTML = '';
    lista.forEach(p => {
        if (!p.historia) return;
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-historia';
        const textoCorto = p.historia.slice(0, 150);
        const tieneMas = p.historia.length > 150;

        tarjeta.innerHTML = `
            <div class="historia-imagen">
                <img src="${p.sprite}" alt="${p.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2260%22>❓</text></svg>'">
            </div>
            <div class="historia-contenido">
                <div class="historia-nombre">${formatearNumeroPokemon(p)} ${p.nombre}</div>
                <div class="historia-tipos">${p.tipos.map(t => `<span class="tipo-mini tipo-${t}">${t}</span>`).join('')}</div>
                <p class="historia-texto">
                    ${tieneMas ? textoCorto + '...' : p.historia}
                    ${tieneMas ? `<span class="historia-oculta">${p.historia.slice(150)}</span> <button class="btn-leer-mas" data-expandido="false">Leer más</button>` : ''}
                </p>
            </div>
        `;

        const btnLeer = tarjeta.querySelector('.btn-leer-mas');
        if (btnLeer) {
            btnLeer.addEventListener('click', (e) => {
                e.stopPropagation();
                const expandido = btnLeer.dataset.expandido === 'true';
                btnLeer.dataset.expandido = !expandido;
                tarjeta.classList.toggle('expandida');
                btnLeer.textContent = expandido ? 'Leer más' : 'Leer menos';
            });
        }
        tarjeta.addEventListener('click', (e) => {
            if (e.target.closest('.btn-leer-mas')) return;
            abrirModal(p);
        });
        tarjeta.style.cursor = 'pointer';
        historiasGrid.appendChild(tarjeta);
    });
}

buscadorHistorias.addEventListener('input', () => {
    const q = buscadorHistorias.value.toLowerCase().trim();
    if (!q) { mostrarHistorias(DATOS_POKEMON.filter(p => p.historia)); return; }
    const filtrados = DATOS_POKEMON.filter(p =>
        p.historia && p.nombre.toLowerCase().includes(q)
    );
    if (filtrados.length === 0) {
        historiasGrid.innerHTML = '<div class="sin-resultados"><span class="icono">📜</span>No se encontraron historias para "<strong>' + q + '</strong>"</div>';
    } else {
        mostrarHistorias(filtrados);
    }
});

// ===== QUIZ =====
const PREGUNTAS_QUIZ = [
    { pregunta: '¿Qué tipo es super eficaz contra Agua?', opciones: ['Fuego', 'Planta', 'Eléctrico', 'Lucha'], correcta: 2 },
    { pregunta: '¿Contra qué tipo es débil el tipo Planta?', opciones: ['Agua', 'Tierra', 'Hielo', 'Fuego'], correcta: 3 },
    { pregunta: '¿Qué tipo NO le afecta a Fantasma?', opciones: ['Psíquico', 'Siniestro', 'Normal', 'Veneno'], correcta: 2 },
    { pregunta: '¿El tipo Lucha es super eficaz contra...?', opciones: ['Fantasma', 'Volador', 'Normal', 'Veneno'], correcta: 2 },
    { pregunta: '¿Qué tipo es inmune a Tierra?', opciones: ['Roca', 'Volador', 'Bicho', 'Eléctrico'], correcta: 1 },
    { pregunta: '¿El tipo Psíquico es super eficaz contra...?', opciones: ['Lucha', 'Siniestro', 'Acero', 'Fantasma'], correcta: 0 },
    { pregunta: '¿Contra qué tipo es débil Dragón?', opciones: ['Hielo', 'Eléctrico', 'Agua', 'Fuego'], correcta: 0 },
    { pregunta: '¿El tipo Hielo es super eficaz contra...?', opciones: ['Agua', 'Fuego', 'Planta', 'Acero'], correcta: 0 },
    { pregunta: '¿Qué tipo resiste al tipo Lucha?', opciones: ['Roca', 'Siniestro', 'Fantasma', 'Normal'], correcta: 2 },
    { pregunta: '¿El tipo Tierra es super eficaz contra...?', opciones: ['Agua', 'Planta', 'Volador', 'Eléctrico'], correcta: 3 },
    { pregunta: '¿Qué tipo es inmune a Psíquico?', opciones: ['Lucha', 'Veneno', 'Siniestro', 'Hada'], correcta: 2 },
    { pregunta: '¿El tipo Fuego es super eficaz contra...?', opciones: ['Agua', 'Roca', 'Dragón', 'Hielo'], correcta: 3 },
    { pregunta: '¿El tipo Dragón resiste a...?', opciones: ['Hada', 'Eléctrico', 'Hielo', 'Fuego'], correcta: 3 },
    { pregunta: '¿Qué tipo es débil contra Hada?', opciones: ['Normal', 'Dragón', 'Agua', 'Planta'], correcta: 1 },
    { pregunta: '¿El tipo Acero resiste cuántos tipos?', opciones: ['5', '7', '9', '11'], correcta: 2 },
    { pregunta: '¿Qué tipo es super eficaz contra Siniestro?', opciones: ['Psíquico', 'Fantasma', 'Lucha', 'Hada'], correcta: 2 },
    { pregunta: '¿El tipo Volador es inmune a...?', opciones: ['Lucha', 'Tierra', 'Bicho', 'Planta'], correcta: 1 },
    { pregunta: '¿Contra qué tipo es débil Eléctrico?', opciones: ['Agua', 'Volador', 'Tierra', 'Roca'], correcta: 2 },
];

const TOTAL_PREGUNTAS = 10;
let preguntasSeleccionadas = [];
let preguntaActual = 0;
let puntaje = 0;
let respondido = false;

const textoPregunta = document.getElementById('textoPregunta');
const quizOpciones = document.getElementById('quizOpciones');
const quizFeedback = document.getElementById('quizFeedback');
const btnSiguiente = document.getElementById('btnSiguiente');
const btnReiniciar = document.getElementById('btnReiniciar');
const puntajeActualSpan = document.getElementById('puntajeActual');
const preguntaActualSpan = document.getElementById('preguntaActual');
const totalPreguntasSpan = document.getElementById('totalPreguntas');

function barajar(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function iniciarQuiz() {
    preguntasSeleccionadas = barajar([...PREGUNTAS_QUIZ]).slice(0, TOTAL_PREGUNTAS);
    preguntaActual = 0;
    puntaje = 0;
    respondido = false;
    actualizarPuntuacion();
    btnReiniciar.classList.add('oculto');
    btnSiguiente.classList.add('oculto');
    mostrarPregunta();
}

function mostrarPregunta() {
    if (preguntaActual >= preguntasSeleccionadas.length) { terminarQuiz(); return; }
    const q = preguntasSeleccionadas[preguntaActual];
    textoPregunta.textContent = q.pregunta;
    quizOpciones.innerHTML = '';
    quizFeedback.textContent = '';
    quizFeedback.className = 'quiz-feedback';
    respondido = false;
    btnSiguiente.classList.add('oculto');
    preguntaActualSpan.textContent = preguntaActual + 1;

    q.opciones.forEach((opcion, idx) => {
        const btn = document.createElement('button');
        btn.className = 'btn-opcion';
        btn.textContent = (idx + 1) + '. ' + opcion;
        btn.addEventListener('click', () => responder(idx));
        quizOpciones.appendChild(btn);
    });
}

function responder(idx) {
    if (respondido) return;
    respondido = true;
    const q = preguntasSeleccionadas[preguntaActual];
    const opciones = quizOpciones.querySelectorAll('.btn-opcion');
    opciones.forEach((btn, i) => btn.disabled = true);

    if (idx === q.correcta) {
        opciones[idx].classList.add('correcta');
        quizFeedback.textContent = '¡Correcto! 🎉 Bien hecho, entrenador.';
        quizFeedback.className = 'quiz-feedback feedback-correcto';
        puntaje++;
        actualizarPuntuacion();
    } else {
        opciones[idx].classList.add('incorrecta');
        opciones[q.correcta].classList.add('correcta');
        quizFeedback.textContent = '¡Incorrecto! La respuesta era: ' + opciones[q.correcta].textContent;
        quizFeedback.className = 'quiz-feedback feedback-incorrecto';
    }
    btnSiguiente.classList.remove('oculto');
}

function actualizarPuntuacion() {
    puntajeActualSpan.textContent = puntaje;
    totalPreguntasSpan.textContent = preguntasSeleccionadas.length;
}

function terminarQuiz() {
    textoPregunta.textContent = '🏆 ¡Quiz completado!';
    quizOpciones.innerHTML = '';
    const mensaje = puntaje === TOTAL_PREGUNTAS ? '¡Perfecto! Eres un maestro Pokémon.' :
        puntaje >= 7 ? '¡Muy bien! Sigue así.' :
        puntaje >= 4 ? 'Buen intento. ¡Sigue practicando!' :
        'Sigue estudiando la tabla de tipos.';
    quizFeedback.textContent = `Puntuación final: ${puntaje}/${TOTAL_PREGUNTAS} — ${mensaje}`;
    quizFeedback.className = 'quiz-feedback ' + (puntaje >= 7 ? 'feedback-correcto' : 'feedback-incorrecto');
    btnSiguiente.classList.add('oculto');
    btnReiniciar.classList.remove('oculto');
}

btnSiguiente.addEventListener('click', () => { preguntaActual++; mostrarPregunta(); });
btnReiniciar.addEventListener('click', iniciarQuiz);
iniciarQuiz();

// ===== EVOLUCIONES =====
const selectEvo = document.getElementById('selectEvolucion');
const evoContenedor = document.getElementById('evolucionContenedor');

async function construirEvoluciones() {
    const cadenasBase = [
        { id: 1, nombre: 'Bulbasaur → Ivysaur → Venusaur → Mega Venusaur' },
        { id: 4, nombre: 'Charmander → Charmeleon → Charizard → Mega X/Y' },
        { id: 7, nombre: 'Squirtle → Wartortle → Blastoise → Mega Blastoise' },
        { id: 25, nombre: 'Pikachu → Raichu' },
        { id: 37, nombre: 'Vulpix → Ninetales' },
        { id: 129, nombre: 'Magikarp → Gyarados → Mega Gyarados' },
        { id: 133, nombre: 'Eevee → 8 evoluciones' },
        { id: 92, nombre: 'Gastly → Haunter → Gengar → Mega Gengar' },
        { id: 147, nombre: 'Dratini → Dragonair → Dragonite' },
        { id: 63, nombre: 'Abra → Kadabra → Alakazam → Mega Alakazam' },
        { id: 150, nombre: 'Mewtwo → Mega Mewtwo X/Y' },
    ];

    for (const cadena of cadenasBase) {
        const opt = document.createElement('option');
        opt.value = cadena.id;
        opt.textContent = cadena.nombre;
        selectEvo.appendChild(opt);
    }

    selectEvo.addEventListener('change', () => mostrarEvolucionDesdeAPI(parseInt(selectEvo.value)));
    mostrarEvolucionDesdeAPI(1);
}

async function mostrarEvolucionDesdeAPI(idInicial) {
    evoContenedor.innerHTML = '<div style="color:rgba(255,255,255,0.5);padding:20px;">Cargando cadena evolutiva...</div>';

    try {
        const speciesResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${idInicial}/`);
        const speciesData = await speciesResp.json();
        const evoChainUrl = speciesData.evolution_chain.url;
        const evoResp = await fetch(evoChainUrl);
        const evoData = await evoResp.json();

        const pasos = [];
        function recorrerCadena(chain, nivel) {
            const name = chain.species.name;
            const poke = DATOS_POKEMON.find(p => p.nombreIngles === name);
            pasos.push({
                nombre: poke ? poke.nombre : name.charAt(0).toUpperCase() + name.slice(1),
                sprite: poke ? poke.sprite : `https://img.pokemondb.net/sprites/scarlet-violet/normal/${name}.png`,
                detalle: nivel === 0 ? 'Base' : (chain.evolution_details[0]?.min_level ? `Nivel ${chain.evolution_details[0].min_level}` : 'Evolución'),
            });
            if (chain.evolves_to.length > 0) {
                chain.evolves_to.forEach(c => recorrerCadena(c, nivel + 1));
            }
        }
        recorrerCadena(evoData.chain, 0);

        // Agregar megaevoluciones relacionadas
        const megasRelacionadas = MEGA_EVOLUCIONES.filter(m => {
            const base = DATOS_POKEMON.find(p => p.id === idInicial);
            const baseId = base ? base.id : idInicial;
            return m.base === baseId || pasos.some(p => {
                const pokeMatch = DATOS_POKEMON.find(d => d.nombre === p.nombre);
                return pokeMatch && m.base === pokeMatch.id;
            });
        });
        megasRelacionadas.forEach(m => {
            const poke = DATOS_POKEMON.find(p => p.id === m.id);
            if (poke) {
                pasos.push({
                    nombre: m.nombre,
                    sprite: poke.sprite,
                    detalle: 'Megaevolución',
                    mega: true,
                });
            }
        });

        evoContenedor.innerHTML = '';
        pasos.forEach((paso, i) => {
            const div = document.createElement('div');
            div.className = 'paso-evolucion';
            div.innerHTML = `
                <img src="${paso.sprite}" alt="${paso.nombre}" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%2280%22 font-size=%2260%22>❓</text></svg>'">
                <div class="nombre-evo">${paso.nombre}</div>
                <div class="detalle-evo">${paso.detalle}</div>
                ${paso.mega ? '<div class="etiqueta-mega">MEGA</div>' : ''}
            `;
            evoContenedor.appendChild(div);
            if (i < pasos.length - 1) {
                const flecha = document.createElement('span');
                flecha.className = 'flecha-evolucion';
                flecha.textContent = '→';
                evoContenedor.appendChild(flecha);
            }
        });
    } catch (err) {
        evoContenedor.innerHTML = '<div style="color:#ff6666;padding:20px;">Error al cargar la cadena evolutiva.</div>';
    }
}

// ===== INICIO =====
cargarPokemon();
