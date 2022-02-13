const cancionesList = [
    {
        nombre : '512',
        artista : 'Mora & Jhay Cortez',
        file : '1.mp3',
        caratula : '1.jpg'
    },
    {
        nombre : 'Colorín Colorado',
        artista : 'Justin Quiles',
        file : '2.mp3',
        caratula : '2.jpg'
    },
    {
        nombre : 'Día De Pago',
        artista : 'Duki & Ovi',
        file : '3.mp3',
        caratula : '3.png'
    },
    {
        nombre : 'Me Gusta Lo Simple',
        artista : 'Duki & Aleman',
        file : '4.mp3',
        caratula : '4.jpg'
    },
    {
        nombre : 'Salimo De Noche',
        artista : 'Tiago PZK & Trueno',
        file : '5.mp3',
        caratula : '5.png'
    },
    {
        nombre : 'Yo Voy',
        artista : 'Zion & Lennox feat. Daddy Yankee',
        file : '7.mp3',
        caratula : '7.png'
    }
]

// capturo cancion actual 
let actualSong = null;

// capturar elementos del DOM
const songs = document.getElementById('listadoCanciones');
const audio = document.getElementById('audio');
const caratula = document.getElementById('caratula');
const nombreCancion = document.getElementById('nombreCancion');
const artista = document.getElementById('artista');
const play = document.getElementById('play');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const progress = document.getElementById('barrita');
const barraContenedora = document.getElementById('contenedorBarra');



// escucho el click de play para pusar/reproducir
play.addEventListener( 'click', () => audio.paused ? playSong() : pausarSong() ); // condicion ? (true) ? (false)

next.addEventListener( 'click', () => nextSong());
prev.addEventListener( 'click', () => prevSong());

barraContenedora.addEventListener('click', cambiarProgreso)
// cargar links de canciones 
function cargaSongs() {
    cancionesList.forEach((song, index) =>{
        // crear li
        const item = document.createElement('li');
        // crear a
        const link = document.createElement('a');
        link.href = '#';
        //agrego contenido a etiqueta a
        link.textContent = song.nombre;
        //agrego a dentro de un li
        item.appendChild(link);
        //agrego li dentro del ul
        songs.appendChild(item);
        // escucho click de la lista de canciones cargadas para reproducir esa cancion y demas
        link.addEventListener('click', () => loadSong(index));
    })
}

// cargar canciones
function loadSong(indiceSong) { // traigo el indice del link de la cancion que hice click
    audio.src ='./music/' + cancionesList[indiceSong].file;    
    actualSong = indiceSong
    playSong();
    cambioBotones();
    datosSongs(indiceSong);    
}




// cargo el datos e imagenes de la cancion que se esta reproduciendo
function datosSongs(indice) {
    caratula.src ='./assets/' + cancionesList[indice].caratula; 

    //agrego el nombre de la cancion y el artista que se esta escuchando
    nombreCancion.textContent = cancionesList[indice].nombre; 
    artista.textContent =cancionesList[indice].artista; 
}



audio.addEventListener('timeupdate' , actualizarProgreso);

// proxima cancion al terminar una
audio.addEventListener('ended', () => nextSong())

// barra de progreso
function actualizarProgreso(event) { // no entiendo este parametro
    const {duration, currentTime} = event.srcElement; // no entiendo
    porcentaje = currentTime * 100 / duration;
    progress.style.width = porcentaje + '%';
}
// modificar barra de proceso
function cambiarProgreso(event) {
    const barraProgreso = this.offsetWidth; // obtengo el ancho de la barra total contenedora por cada cancion
    const anchoProgreso = event.offsetX; // obtengo el ancho de la barra en el punto que hago click del total de la barra
    const punto = (anchoProgreso / barraProgreso) * audio.duration; // lo multiplico por la duracion para ver que parte de la cancion equivale ese click en la barra
    audio.currentTime = punto;
}
function nextSong() { // funcionalidad al boton de siguiente cancion
    if (actualSong < cancionesList.length -1) {
        loadSong(actualSong + 1)
    } else {
        loadSong(0)
    }
}
function prevSong() { // funcionalidad al boton de anterior cancion
    if (actualSong > 0) {
        loadSong(actualSong - 1)
    } else {
        loadSong(cancionesList.length - 1)
    }
}
function cambioBotones() { // actualizar el icono de play/pausa
    if (audio.paused) {
        play.classList.replace("fa-pause","fa-play"); // primer parametro el que se borra , 2do el que se agrega
    }else{
        play.classList.replace("fa-play","fa-pause");
    }
}
function playSong() { // reproducir cancion
    audio.play();
    cambioBotones();
}
function pausarSong() { // pausarr cancion
    audio.pause(); // pausar audio
    cambioBotones();
}
cargaSongs();