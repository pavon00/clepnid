const PRE = "CLEPNID"
const SUF = "MEET"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var inicio = true;
var peer = null;
var clickCount = 0;
var timerClick = null;
var timerClickMouseContext = null;
var mouseContextEfect = false;
var timerClickMouseDrag = null;
var timerClickMouseMove = null;
var mouseDragEfect = false;
var mouseMoveEfect = false;
var mouseDoubleClickEfect = false;
var currentPeer = null
var textAreaVisible = false;
var screenSharing = false
var arrayCaracteresTeclas=[];
var posMouseX = 0;
var posMouseY = 0;

document.addEventListener('click', event => {
    if (inicio) {
        hideEntryModal();
        showResizeModal();
        let video = document.getElementById("remote-video");
        video.play();
        estilarVideo();
        inicio = false;
    }
});
function hideEntryModal() {
    document.getElementById("entry-modal").hidden = true
}
function hideResizeModal() {
    document.getElementById("resize-modal").style.display = 'none'
}
function showResizeModal() {
    const content = document.getElementById("resize-modal");
    content.style.margin = 'auto'
    content.style.display = 'flex'
    content.style.rowGap = '4px'
    content.style.columGap = '4px'
    content.style.justifyContent= "space-between" 
    content.style.zIndex = '9999'
    content.style.position = 'absolute'
    content.style.top = '10'
    content.style.color = '#fff'
    content.style.textAlign = 'center'
    var elementos = document.getElementsByClassName("button-absolute");
    for (var i = 0; i < elementos.length; i++) {
        elementos[i].style.width="60px";
        elementos[i].style.height="60px";
    }

}
function estilarVideo() {
    const contenedor = document.getElementById("contenedor");
    const video= document.getElementById("remote-video");

    sizeX = video.clientWidth;
    sizeY = video.clientHeight;
    if (sizeX>sizeY) {
        console.log('x>y');
        video.style.height = 'auto';
        video.style.width = '100%';
    }
    if (sizeY>sizeX) {
        console.log('y>x');
        video.style.height = '100%';
        video.style.width = 'auto';
    }
    if (sizeY===sizeX) {
        console.log('y=x');
        video.style.height = '100%';
        video.style.width = '100%';
    } 
    contenedor.style.display= 'flex';
    contenedor.style.alignItems= 'center';
    contenedor.style.justifyContent= 'center';
    contenedor.style.width= '100%';
    contenedor.style.height= '100%';
    
}
function getPos(e){
    if (!inicio) {
        setPosMouse(e);
    }
}
function getPosMouseX(e, box){
    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.touches[0];
        x = touch.clientX;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        x = e.clientX;
    }
    sizeX = box.clientWidth;
    sizeBodyX = document.body.clientWidth;
    diferenciaX = (sizeBodyX-sizeX)/2;
    return ((x-diferenciaX) / sizeX) * 80;
}

function getPosMouseY(e, box){
    if(e.type == 'touchstart' || e.type == 'touchmove' || e.type == 'touchend' || e.type == 'touchcancel'){
        var touch = e.touches[0];
        y = touch.clientY;
    } else if (e.type == 'mousedown' || e.type == 'mouseup' || e.type == 'mousemove' || e.type == 'mouseover'|| e.type=='mouseout' || e.type=='mouseenter' || e.type=='mouseleave') {
        y = e.clientY;
    }
    sizeY = box.clientHeight;
    sizeBodyY = document.body.clientHeight;
    diferenciaY = (sizeBodyY-sizeY)/2;
    return ((y-diferenciaY) / sizeY) * 80;
}

function setPosMouse(e){
    const box = document.getElementById("remote-video");
    posMouseX = getPosMouseX(e, box);
    posMouseY = getPosMouseY(e, box);
}

function setRemoteStream(stream) {

    let video = document.getElementById("remote-video");
    video.srcObject = stream;
}
hideResizeModal();
console.log("Joining Room")

room_id = PRE + 1 + SUF;
peer = new Peer()
peer.on("call", (call)=>{
    call.on("stream", (remoteStream)=>{
        setRemoteStream(remoteStream);
    });
    call.answer(null);
});
peer.on('open', () => {
    peer.connect(room_id);
})

const resizeButton = document.getElementById("resize-button");
  resizeButton.addEventListener('click', () => {
    const div = document.getElementById('contenedor');
    if (div.requestFullscreen) 
            div.requestFullscreen();
    else if (div.webkitRequestFullscreen) 
            div.webkitRequestFullscreen();
    else if (div.msRequestFullScreen) 
            div.msRequestFullScreen();
  });


document.body.addEventListener('contextmenu', function(event) {
    if (!inicio && !textAreaVisible) {
        event.preventDefault();
    }
});

document.body.addEventListener('dblclick', function(event) {
    if (!inicio && !textAreaVisible) {
        event.preventDefault();
    }
});

document.body.addEventListener('touchmove', function(event) {
    if (!inicio && !textAreaVisible) {
        event.preventDefault();
    }
});



document.onkeydown = function(event) {
    if (!inicio && !textAreaVisible) {
        event.preventDefault();
        var caracter = event.key;
        if (!arrayCaracteresTeclas.includes(caracter)) {
            arrayCaracteresTeclas.push(caracter);
            console.log("Pulsaglkyuda tecla: "+caracter);
            fetchOnKeyDown(caracter);
        }
    }
        
};

document.onkeyup = function(event) {
    if (!inicio && !textAreaVisible) {
        event.preventDefault();
        var caracter = event.key;
        var indice = arrayCaracteresTeclas.indexOf(caracter);
        if (indice !== -1) {
            arrayCaracteresTeclas.splice(indice, 1);
            fetchOnKeyUp(caracter);
            console.log('El caracter ' + caracter + ' ha sido eliminado del array.');
        } 
    }
};

async function fetchOnKeyDown(caracter) {
    if (caracter==='+') {
        caracter = "plus";
    }
    const response = await fetch('/controlClepnid/tecladoDown?caracter='+caracter);
}

async function fetchOnKeyUp(caracter) {
    if (caracter==='+') {
        caracter = "plus";
    }
    const response = await fetch('/controlClepnid/tecladoUp?caracter='+caracter);
}

const focusArea = document.getElementById("focusArea");

//arrastrar para abajo no lo hace
document.body.addEventListener('touchmove', function (event) {
   event.preventDefault();
});

focusArea.addEventListener('touchmove', function (event) {
    event.preventDefault();
    setPosMouse(event);
    fetchOnMouseMove(posMouseX, posMouseY);
});

focusArea.addEventListener('touchend', function (event) {
   dejarDeArrastrar();
});

focusArea.addEventListener('touchcancel', function (event) {
   dejarDeArrastrar();
});

focusArea.addEventListener('touchstart', function (event) {
    if (clickCount === 1) {
        clickCount++;
    }
    if (clickCount === 2) {
        clearTimeout(timerClick);
        clearTimeout(timerClickMouseContext);
        mouseDoubleClickEfect = true;
        setPosMouse(event);  
        fetchOnMouseMove(posMouseX, posMouseY);
        timerClickMouseDrag = setTimeout(() => {
            mouseDragEfect = true;
            fetchOnMouseDown();
        }, 200);
    }
});

focusArea.addEventListener("mousedown", function(event) {
    event.preventDefault();
    if (event.button == 2 || mouseDoubleClickEfect) {
        return;
    }
    if (mouseDragEfect) {
        return;
    }
    clickCount++;
    if (clickCount ===1) {
        setPosMouse(event);  
        fetchOnMouseMove(posMouseX, posMouseY);
        timerClickMouseContext = setTimeout(() => {
            if (!mouseDoubleClickEfect) {
                fetchOnContextMenu();
                mouseContextEfect = true;
                clickCount=0;
            }
        }, 700);
        return;
    }
    if (clickCount ===2) {
        clearTimeout(timerClick);
        clearTimeout(timerClickMouseContext);
        mouseDoubleClickEfect = true;
        setPosMouse(event);  
        fetchOnMouseMove(posMouseX, posMouseY);
        timerClickMouseDrag = setTimeout(() => {
            mouseDragEfect = true;
            fetchOnMouseDown();
        }, 1000);
        return;
    }
  });

function dejarDeArrastrar(){
    mouseDragEfect = false;
    fetchOnMouseUp();
    clickCount = 0;
}

focusArea.addEventListener("mouseup", function(event) {
    event.preventDefault();
    if (event.button == 2) {
        return;
    }
    if (mouseDragEfect) {
        dejarDeArrastrar();
        return;
    }
    if (mouseDoubleClickEfect) {
        clearTimeout(timerClickMouseDrag);
        fetchOnMouseDown();
        fetchOnMouseUp();
        fetchOnMouseDown();
        fetchOnMouseUp();
        mouseDoubleClickEfect = false;
        clickCount=0;
        return;
    }

    if (clickCount === 1) {
        if (!mouseContextEfect) {
            timerClick = setTimeout(() => {
                fetchOnMouseDown();
                fetchOnMouseUp();
                clickCount = 0;
            }, 500);
            clearTimeout(timerClickMouseContext);
        }
        return;
    }
});

focusArea.addEventListener("contextmenu", function(event) {
  // Acciones a realizar al hacer clic derecho en el elemento
  event.preventDefault();
  fetchOnContextMenu(); // Prevención de la acción por defecto del navegador
});

async function fetchOnMouseDown() {
    console.log('mouseDown');
    const response = await fetch('/controlClepnid/mouseDown');
}

async function fetchOnMouseUp() {
    console.log('mouseUp');
    const response = await fetch('/controlClepnid/mouseUp');
}

async function fetchOnContextMenu() {
    event.preventDefault();
    console.log('contextmenu');
    const response = await fetch('/controlClepnid/contextMenu');
}
    
async function fetchOnMouseMove(cursorX, cursorY) {
    if (mouseMoveEfect) {return}
    if (cursorX<0) {return}
    if (cursorY<0) {return}
    if (cursorX>100) {return}
    if (cursorY>100) {return}
    mouseMoveEfect = true;
    timerClickMouseMove = setTimeout( async function(){
        mouseMoveEfect = false;
        const response = await fetch('/controlClepnid/mouseMove?x='+cursorX+'&y='+cursorY);
    }, 70);
}

// Obtener el botón y la ventana modal
const btnAbrirModal = document.getElementById("input-keys-button");
const modal = document.getElementById("modal-textarea");

// Obtener el botón para enviar el texto y el área de texto
const btnEnviar = document.getElementById("btn-enviar");
const btnPegar = document.getElementById("btn-pegar");
const textArea = document.getElementById("mi-textarea");

// Cuando se hace clic en el botón "Abrir modal"
btnAbrirModal.onclick = function() {
    if (textAreaVisible) {
        textAreaVisible = false;
        modal.style.display = "none";
    }else{
        textAreaVisible = true;
        modal.style.display = "block";
    }
  
}

// Cuando se hace clic en el botón "Enviar"
btnEnviar.onclick = function() {
        event.preventDefault();
  const texto = textArea.value;

  // Realizar una solicitud de fetch para enviar el texto
  fetch("/controlClepnid/pegarTexto", {
    method: "POST",
    body: JSON.stringify({texto: texto}),
    headers: {"Content-Type": "application/json"}
  })
  .then(response => {
    if (!response.ok) {
      throw new Error("Error al enviar el texto");
    }
    textAreaVisible = false;
    modal.style.display = "none"; // Cerrar la ventana modal
  })
  .catch(error => {
    console.error(error);
  });
}


