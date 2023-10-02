let Btn = document.getElementById("btn");
let URLinput = document.querySelector(".URL-input");
let nameOutput = document.querySelector(".URL-name-output");
let select = document.querySelector(".opt");
let selectQuality = document.querySelector(".qua");
let selectTipeUrl = document.querySelector(".tip");

Btn.addEventListener("click", () => {
  if (!URLinput.value) {
    alert("Enter YouTube URL");
  } else {
    if (!nameOutput.value) {
      alert("Enter Name File Output");
    } else {
      if (selectTipeUrl.value == "youtube") {
        if (select.value == "mp3") {
          redirectMp3Youtube(
            URLinput.value,
            selectQuality.value,
            nameOutput.value
          );
        } else {
          redirectVideoYoutube(
            URLinput.value,
            select.value,
            selectQuality.value,
            nameOutput.value
          );
        }
      } else {
        if (select.value == "mp3") {
          redirectMp3(URLinput.value, nameOutput.value);
        } else {
          redirectVideo(URLinput.value, select.value, nameOutput.value);
        }
      }
    }
  }
});

function redirectMp3Youtube(url, quality, outputName) {
  window.location.href = `/downloadYoutubemp3?url=${url}&quality=${quality}&outputName=${outputName}`;
}

function redirectVideoYoutube(url, format, quality, outputName) {
  window.location.href = `/downloadYoutubemp4?url=${url}&format=${format}&quality=${quality}&outputName=${outputName}`;
}
function redirectMp3(url, outputName) {
  window.location.href = `/downloadOthermp3?url=${url}&outputName=${outputName}`;
}

function redirectVideo(url, format, outputName) {
  window.location.href = `/downloadOthermp4?url=${url}&outputName=${outputName}.${format}`;
}
