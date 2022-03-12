let cancionesList = [];
let favoritass = [];

fetch('./datos.json')
    .then(datos => datos.json())
    .then(datos => {
        cargaSongs(datos);
        cancionesList = datos;
        aleatorioFuntion(datos);
        misFav(datos);
    }
)

    
    

    
// capturo cancion actual 
let actualSong = null;

// ---------- capturar elementos del DOM ---------- 
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
const barraVol = document.getElementById('barraVol')
const miTable = document.getElementById('miTable');
const aleatorio = document.getElementById('aleatorio');
const volumenIcon = document.getElementById('volumenIcon');
const looper = document.getElementById('looper');
const favorito = document.getElementById('favorito');


// escucho el click de play para pusar/reproducir
play.addEventListener( 'click', () => audio.paused ? playSong() : pausarSong() ); // condicion ? (true) ? (false)

next.addEventListener( 'click', () => nextSong());
prev.addEventListener( 'click', () => prevSong());

barraVol.addEventListener( 'click', () => volumenAccion());


barraContenedora.addEventListener('click', cambiarProgreso)



// cargar links de canciones 
function cargaSongs(cancionesList) {
    cancionesList.forEach((song, index) =>{
        // creo elementos
        const item = document.createElement('tr');
        const link1 = document.createElement('th');
        const link2 = document.createElement('th');
        const link3 = document.createElement('th');
        const link4 = document.createElement('th');
        const ancla = document.createElement('a');

        // les asigno informacion
        ancla.href = '#';
        ancla.textContent = song.nombre;

        link1.textContent = song.id;
        link3.textContent = song.artista;
        link4.textContent = song.id;

        // le asigno un padre
        link2.appendChild(ancla);

        item.appendChild(link1);
        item.appendChild(link2);
        item.appendChild(link3);
        item.appendChild(link4);

        miTable.appendChild(item);

        // escucho click de la lista de canciones cargadas para reproducir esa cancion y demas
        ancla.addEventListener('click', () => loadSong(index));
    })
}

favorito.addEventListener('click',() => {
    if (!favoritass.includes(actualSong)) {
        favoritass.push(actualSong);
    }
    console.log(favoritass);
})
// cargar canciones
function loadSong(indiceSong) { // traigo el indice del link de la cancion que hice click
    audio.src ='./music/' + cancionesList[indiceSong].file;   
    actualSong = indiceSong;
    playSong();
    cambioBotones();
    datosSongs(indiceSong);    
    Toastify({
        text: `estas escuchando: ${cancionesList[indiceSong].nombre}`,
        duration: 1000,
        style: {
            background: "transparent",
            color: "#fff"
        },
    }).showToast();


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






//volumen
volumenIcon.addEventListener('click',() => {
    audio.muted ? audio.muted = false : audio.muted = true;
    volumenIcon.classList.toggle('fa-volume-off');
})
function volumenAccion() {
    audio.volume =  barraVol.value;
    if (audio.volume === 0) {
        volumenIcon.classList.remove('fa-volume-low');
        volumenIcon.classList.remove('fa-volume-high');
        volumenIcon.classList.add('fa-volume-off');
    }
    if (audio.volume > 0 && audio.volume < .5) {
        volumenIcon.classList.remove('fa-volume-off');
        volumenIcon.classList.remove('fa-volume-high');
        volumenIcon.classList.add('fa-volume-low');
    } else if(audio.volume >= .5){
        volumenIcon.classList.remove('fa-volume-off');
        volumenIcon.classList.remove('fa-volume-low');
        volumenIcon.classList.add('fa-volume-high');
    }
}




// barra de progreso
function actualizarProgreso(event) { // event es un argumento para usar los metodos y propiedades de los eventos
    const {duration, currentTime} = event.srcElement; // Desestructuración de objetos en JavaScript
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
function aleatorioFuntion(dato) {
    aleatorio.addEventListener('click',() => {
        loadSong(Math.floor(Math.random() * dato.length));    // numeros aleatorios enteros del 0 al dato.length
    })
}




looper.addEventListener('click',() => {
    if (audio.loop == false) {
        audio.loop = true;
        looper.style.color = 'wheat';
    }else if (audio.loop == true){
        audio.loop = false;
        looper.style.color = 'black';
    }
})



