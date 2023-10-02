let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played


let track_index = track_list.index;

function random_bg_color() {

    // Get a number between 64 to 256 (for getting lighter colors)
    let red = Math.floor(Math.random() * 256) + 64;
    let green = Math.floor(Math.random() * 256) + 64;
    let blue = Math.floor(Math.random() * 256) + 64;

    // Construct a color withe the given values
    let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

    // Set the background to that color
    document.body.style.background = bgColor;
}

var GetFileBlobUsingURL = function(url, convertBlob) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url);
    xhr.responseType = "blob";
    xhr.addEventListener('load', function() {
        convertBlob(xhr.response);
    });
    xhr.send();
};

var blobToFile = function(blob, name) {
    blob.lastModifiedDate = new Date();
    blob.name = name;
    return blob;
};

var GetFileObjectFromURL = function(filePathOrUrl, convertBlob) {
    GetFileBlobUsingURL(filePathOrUrl, function(blob) {
        var nombre = track_list.content[track_index].path.split("/");
        convertBlob(blobToFile(blob, nombre[nombre.length - 1]));
    });
};

function loadTrack(track_index) {
    clearInterval(updateTimer);
    resetValues();

    curr_track.src = track_list.content[track_index].stream;


    GetFileObjectFromURL(track_list.content[track_index].path, function(fileObject) {
        var file = new File([fileObject], "name");
        console.log(file);
        jsmediatags.read(fileObject, {
            onSuccess: function(tag) {
                console.log

                // Array buffer to base64
                const data = tag.tags.picture.data;
                const format = tag.tags.picture.format;
                let base64String = "";
                for (let i = 0; i < data.length; i++) {
                    base64String += String.fromCharCode(data[i]);
                }

                console.log(tag.tags.title);
                console.log(tag.tags.artist);
                if (base64String === "") {
                    if (track_list.content[track_index].image === undefined) {
                        track_art.style.backgroundImage = "url(cover.jpg)";
                    } else {
                        track_art.style.backgroundImage = "url(" + track_list.content[track_index].image + ")";
                    }
                } else {
                    track_art.style.backgroundImage = `url(data:${format};base64,${window.btoa(base64String)})`;
                }

                if (!tag.tags.title === undefined) {
                    track_name.textContent = tag.tags.title;
                }
                track_artist.textContent = tag.tags.artist;
                console.log(tag.tags.TLE);

            },
            onError: function(error) {
                console.log(error);
            }
        });
    });

    curr_track.load();
    if (track_list.content[track_index].image === undefined) {
        track_art.style.backgroundImage = "url(cover.jpg)";
    } else {
        track_art.style.backgroundImage = "url(" + track_list.content[track_index].image + ")";
    }
    if (track_list.content[track_index].name === undefined) {
        var textName = track_list.content[track_index].path.split("/");
        track_name.textContent = textName[textName.length - 1].split(".")[0];
    } else {
        track_name.textContent = track_list.content[track_index].name;
    }
    track_artist.textContent = track_list.content[track_index].artist;
    now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.content.length;

    updateTimer = setInterval(seekUpdate, 1000);
    curr_track.addEventListener("ended", nextTrack);
    random_bg_color();
}

function resetValues() {
    curr_time.textContent = "00:00";
    total_duration.textContent = "00:00";
    seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);

function playpauseTrack() {
    if (!isPlaying) playTrack();
    else pauseTrack();
}

function playTrack() {
    curr_track.play();
    isPlaying = true;
    playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
    curr_track.pause();
    isPlaying = false;
    playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function nextTrack() {
    if (track_index < track_list.content.length - 1)
        track_index += 1;
    else track_index = 0;
    loadTrack(track_index);
    playTrack();
}

function prevTrack() {
    if (track_index > 0)
        track_index -= 1;
    else track_index = track_list.content.length;
    loadTrack(track_index);
    playTrack();
}

function seekTo() {
    let seekto = curr_track.duration * (seek_slider.value / 100);
    curr_track.currentTime = seekto;
}

function setVolume() {
    curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
    let seekPosition = 0;

    if (!isNaN(curr_track.duration)) {
        seekPosition = curr_track.currentTime * (100 / curr_track.duration);

        seek_slider.value = seekPosition;

        let currentMinutes = Math.floor(curr_track.currentTime / 60);
        let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
        let durationMinutes = Math.floor(curr_track.duration / 60);
        let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

        if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
        if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
        if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
        if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

        curr_time.textContent = currentMinutes + ":" + currentSeconds;
        total_duration.textContent = durationMinutes + ":" + durationSeconds;
    }
}