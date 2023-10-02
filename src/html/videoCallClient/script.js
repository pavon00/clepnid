const PRE = "CLEPNID"
const SUF = "MEET"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var local_stream;
var screenStream;
var peer = null;
var currentPeer = null
var screenSharing = false
document.addEventListener('click', event => {
    hideEntryModal();
    showResizeModal();
    let video = document.getElementById("remote-video");
    video.play();
});
function hideEntryModal() {
    document.getElementById("entry-modal").hidden = true
}
function hideResizeModal() {
    document.getElementById("resize-modal").hidden = true
}
function showResizeModal() {
    document.getElementById("resize-modal").hidden = false
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
        addEventListener("click", event => {
            const btn = event.target;
            if (btn.tagName.toLowerCase() !== "button") return;
            console.log("hola");
            const id = btn.textContent;
            const div = document.getElementById('remote-video');
            if (div.requestFullscreen) 
                    div.requestFullscreen();
            else if (div.webkitRequestFullscreen) 
                    div.webkitRequestFullscreen();
            else if (div.msRequestFullScreen) 
                    div.msRequestFullScreen();
        });



