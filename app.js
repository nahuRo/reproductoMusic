// ---- Arreglos ----
var favoritass = [];
var cancionesList = [];

if (localStorage.getItem('favoritos')) {
    favoritass = JSON.parse(localStorage.getItem('favoritos')) ;
} else {
    var favoritass = [];
}


// ---- Variables ----
let cambiaso = false;
let actualSong = null;
let aleatorio = undefined;
let iconoAdd = undefined;


// ---- Escuchas del Dom ----
// 'enlace' de secciones home y favoritos
const btn_home = document.getElementById('btn_home');
const bth_fav = document.getElementById('bth_fav');

// titulo de las listas (favorito / lista de todas las canciones)
const tituloList = document.getElementById('tituloList');

// controles de reproductor
const btnPlay = document.getElementById('play');
const btnPrev = document.getElementById('prev');
const btnNext = document.getElementById('next');
const btnLooper = document.getElementById('looper');
const btnAleatorio = document.getElementById('aleatorio');

// barras de progreso
const barraContenedora = document.getElementById('contenedorBarra');
const progress = document.getElementById('barrita');

// boton aleatorio grande
const btnPlayRam = document.getElementById('btnPlayRam');

// caratula - nombre de cancion - nombre del artista
const caratulaSong = document.getElementById('caratula');
const nombreCancion = document.getElementById('nombreCancion');
const artista = document.getElementById('artista');

//volumen
const barraVol = document.getElementById('barraVol')
const btnVolumen = document.getElementById('volumenIcon');

// cantidad de canciones
const cantSong = document.getElementById('cantSong');

//texto ininial(principal de la lista)
const textInicial = document.getElementById('textInicial');


// ---- Datos Fetch ----
fetch('./datos.json')
.then(datos => datos.json())
.then(datos => {

    document.addEventListener('DOMContentLoaded', inicio());

    miTable.addEventListener('click', e => {
    
        if (e.target.classList.contains('fa-heart')) {

            if ((!e.target.classList.contains('favoritoAdd'))) {
                e.target.classList.add('active');
            }else{
                e.target.classList.remove('active');
            }
            let cora = e.target.attributes[1].value;
            datos.filter(elemento => {
                if (elemento.id == cora) {
                    if (!favoritass.includes(elemento)) {
                        favoritass.push(elemento);    
                    }else{
                        indexDel = favoritass.indexOf(elemento);
                        favoritass.splice(indexDel,1);
                    }
                }
            });
        }
        localStorage.setItem('favoritos',JSON.stringify(favoritass))
    });
    
    btn_home.addEventListener('click', inicio);

    bth_fav.addEventListener('click', () => {
        bth_fav.classList.add('active');   
        btn_home.classList.remove('active');
        
        tituloList.textContent = 'Favoritos';
        textInicial.textContent = 'Canciones que te gustan 😍';

        cancionesList = favoritass;
        
        iconoAdd = false;
        cargaSongs(favoritass, iconoAdd);      
        
    });
    function inicio() {
        btn_home.classList.add('active');   
        bth_fav.classList.remove('active');
        
        tituloList.textContent = 'Canciones';
        textInicial.textContent = 'Lista de Canciones 😏';
        cancionesList = datos;

        iconoAdd = true;
        cargaSongs(datos, iconoAdd);
        
    }
});

// ---- Funcion interface ----
    function cargaSongs(cancionesList, cora) {
        cantSong.textContent =  cancionesList.length;
        miTable.innerHTML = ''; 
        cancionesList.forEach((song) =>{
            // creo elementos
            const item = document.createElement('tr');
            const link1 = document.createElement('th');
            const link2 = document.createElement('th');
            const link3 = document.createElement('th');
            const link4 = document.createElement('th');
            const link5 = document.createElement('th');
            const ancla = document.createElement('a');
            const button = document.createElement('button')
            
            // les asigno informacion
            ancla.href = '#';
            ancla.textContent = song.nombre;
            
            link1.textContent = song.id;
            link3.textContent = song.artista;
            link4.textContent = song.time;
            if (cora) {
                button.innerHTML = `<i id="favorito" data-id="${song.id}"class="fa-solid fa-heart"></i>`;
            }else{
                button.innerHTML = `<i id="favorito" data-id="${song.id}"></i>`;
            }

            // le asigno un padre
            link2.appendChild(ancla);
            
            link5.appendChild(button);
            
            item.appendChild(link1);
            item.appendChild(link2);
            item.appendChild(link3);
            item.appendChild(link4);
            item.appendChild(link5);
            
            miTable.appendChild(item);
            // escucho click de la lista de canciones cargadas para reproducir esa cancion y demas
            ancla.addEventListener('click', () => loadSong(song.id, cancionesList));
            
        })
}
// ---- Funciones interactivas de la carga ----
function loadSong(idSong, canciones) { // traigo el indice del link de la cancion que hice click
    indice = canciones.findIndex(e => e.id == idSong)
    audio.src ='./music/' + canciones[indice].file;   
    actualSong = indice;
    playSong();
    cambioBotones();
    datosSongs(indice, canciones); 

    Toastify({
        text: `estas escuchando: ${canciones[indice].nombre}`,
        duration: 1000,
        style: {
            background: "transparent",
            color: "#fff"
        },
    }).showToast();
}


// ---- Funciones de la carga  ----
function cambioBotones() { // actualizar el icono de play/pausa
    if (audio.paused) {
        btnPlay.classList.replace("fa-pause","fa-play"); // primer parametro el que se borra , 2do el que se agrega
    }else{
        btnPlay.classList.replace("fa-play","fa-pause");
    }
}

function datosSongs(indice, cancion) {
    //agrego el nombre de la cancion, artista y caratula que se esta escuchando
    caratulaSong.src ='./assets/' + cancion[indice].caratula; 
    nombreCancion.textContent = cancion[indice].nombre; 
    artista.textContent = cancion[indice].artista; 
}

// ---- Funciones complementarias ('2do plano')  ----
    // ---- Eventos
        // click boton play --> pauso / reproduzco
        btnPlay.addEventListener( 'click', () => audio.paused ? playSong() : pausarSong()); 
        // click boton siguiente --> paso a la siguiente cancion
        btnNext.addEventListener( 'click', () => nextSong());
        // click boton atras --> vuelvo a la cancion anterior   
        btnPrev.addEventListener( 'click', () => prevSong());
        // evento al btn aleatorio del control de reproduccion
        btnAleatorio.addEventListener('click',() => cambioStyleAle());
        // evento al btn loop del control de reproduccion
        btnLooper.addEventListener('click',() => cambioStyleLoop());

        //actualizar progreso de la cancion
        audio.addEventListener('timeupdate' , actualizarProgreso);
        // cambiar tiempo actual de reproduccion
        barraContenedora.addEventListener('click', cambiarProgreso);
        // evento cuando termina la cancion actual
        audio.addEventListener('ended', () => finSong());
        // evento al boton aleatoria de la lista de canciones
        btnPlayRam.addEventListener('click',() => aleatorioGenerator());
        // evento para modificar el volumen dependiendo de la barra
        barraVol.addEventListener( 'click', () => volumenAccion());
        // muteo del volumen
        btnVolumen.addEventListener('click',() => muteo());

        

    // ---- Funciones
    function playSong() { // reproducir cancion
        audio.play();
        cambioBotones();
    }
    function pausarSong() { // pausarr cancion
        audio.pause(); // pausar audio
        cambioBotones();
    }
    function nextSong() { // funcionalidad al boton de siguiente cancion
        if (actualSong < cancionesList.length -1) {
            loadSong(cancionesList[actualSong + 1].id,cancionesList);
        } else {
            loadSong(cancionesList[0].id,cancionesList);
        }
    }
    function prevSong() { // funcionalidad al boton de anterior cancion
        if (actualSong > 0) {
            loadSong(cancionesList[actualSong - 1].id,cancionesList);
        } else {
            let ultimo = cancionesList.length - 1;
            loadSong(cancionesList[ultimo].id,cancionesList);
        }
    }
    function cambioStyleAle() {
        if (cambiaso) {
            cambiaso = false;
            btnAleatorio.style.color = 'black';
        }else{
            cambiaso = true;
            btnAleatorio.style.color = '#632626';
        }
    }
    function cambioStyleLoop() {
        if (audio.loop == false) {
            audio.loop = true;
            btnLooper.style.color = '#632626';
        }else if (audio.loop == true){
            audio.loop = false;
            btnLooper.style.color = 'black';
        }
    }
    function actualizarProgreso(event) { // event es un argumento para usar los metodos y propiedades de los eventos
        const {duration, currentTime} = event.srcElement; // Desestructuración de objetos en JavaScript
        porcentaje = currentTime * 100 / duration;
        progress.style.width = porcentaje + '%';
    
    }
    function cambiarProgreso(event) {
        const barraProgreso = this.offsetWidth; // obtengo el ancho de la barra total contenedora por cada cancion
        const anchoProgreso = event.offsetX; // obtengo el ancho de la barra en el punto que hago click del total de la barra
        const punto = (anchoProgreso / barraProgreso) * audio.duration; // lo multiplico por la duracion para ver que parte de la cancion que equivale a ese click en la barra
        audio.currentTime = punto;
    }
    function finSong() {
        if (cambiaso) {
            aleatorioGenerator();
        }else{
            nextSong(); 
        }
    }
    function aleatorioGenerator() {
        let aleatorio = Math.floor(Math.random() * cancionesList.length);
        loadSong(cancionesList[aleatorio].id, cancionesList);
    }
    function volumenAccion() {
        audio.volume =  barraVol.value;

        if (audio.volume === 0) {
            btnVolumen.classList.remove('fa-volume-low');
            btnVolumen.classList.remove('fa-volume-high');
            btnVolumen.classList.add('fa-volume-off');
        }
        if (audio.volume > 0 && audio.volume < .5) {
            btnVolumen.classList.remove('fa-volume-off');
            btnVolumen.classList.remove('fa-volume-high');
            btnVolumen.classList.add('fa-volume-low');
        } else if(audio.volume >= .5){
            btnVolumen.classList.remove('fa-volume-off');
            btnVolumen.classList.remove('fa-volume-low');
            btnVolumen.classList.add('fa-volume-high');
        }
    }
    function muteo() {
        audio.muted ? audio.muted = false : audio.muted = true;
        btnVolumen.classList.toggle('fa-volume-off');
    }