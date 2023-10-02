const PRE = "CLEPNID"
const SUF = "MEET"
var room_id;
var getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
var screenStream;
var peer = null;
var currentPeer = null
var screenSharing = false


function setLocalStream(stream) {

    let video = document.getElementById("local-video");
    video.srcObject = stream;
    video.muted = true;
    video.play();
}

function notify(msg) {
    let notification = document.getElementById("notification")
    notification.innerHTML = msg
    notification.hidden = false
    setTimeout(() => {
        notification.hidden = true;
    }, 3000)
}

function startScreenShare() {
    if (screenSharing) {
        stopScreenSharing()
    }
    navigator.mediaDevices.getDisplayMedia({ video: true, audio: true  }).then((stream) => {
        screenStream = stream;
        let videoTrack = screenStream.getVideoTracks()[0];
        videoTrack.onended = () => {
            stopScreenSharing()
        }
        setLocalStream(screenStream)
        console.log(screenStream)
    })
}

    console.log("Creating Room")
    room_id = PRE + 1 + SUF;
    startScreenShare();
    peer = new Peer(room_id)
    peer.on('connection',(conn)=>{
        conn.on('open', (id) => {
            console.log("Peer Connected with ID: ", id)
            notify("Waiting for peer to join.")
            peer.call(
                conn.peer,
                screenStream
            )
        })
        conn.on('close', (id) => {
            console.log("Peer Connected with ID: ", id)
            notify("peer destroy.")
            conn.peer.disconnect();
        })
    })
    
    

function stopScreenSharing() {
    if (!screenSharing) return;
    let videoTrack = screenStream.getVideoTracks()[0];
    if (peer) {
        let sender = currentPeer.peerConnection.getSenders().find(function (s) {
            return s.track.kind == videoTrack.kind;
        })
        sender.replaceTrack(videoTrack)
    }
    screenStream.getTracks().forEach(function (track) {
        track.stop();
    });
    screenSharing = false
}