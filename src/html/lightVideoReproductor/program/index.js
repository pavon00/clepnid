/********************************************************* 
 * LICENSE: LICENSE-Free_CN.MD
 * 
 * Author: Numberwolf - ChangYanlong
 * QQ: 531365872
 * QQ Group:925466059
 * Wechat: numberwolf11
 * Discord: numberwolf#8694
 * E-Mail: porschegt23@foxmail.com
 * Github: https://github.com/numberwolf/h265web.js
 * 
 * 作者: 小老虎(Numberwolf)(常炎隆)
 * QQ: 531365872
 * QQ群: 531365872
 * 微信: numberwolf11
 * Discord: numberwolf#8694
 * 邮箱: porschegt23@foxmail.com
 * 博客: https://www.jianshu.com/u/9c09c1e00fd1hevc_test_moov_set_head_16s
 * Github: https://github.com/numberwolf/h265web.js
 * 
 **********************************************************/
const SHOW_LOADING = "loading...";
const SHOW_DONE = "done.";

function durationFormatSubVal(val) {
    let valStr = val.toString();
    if (valStr.length < 2) {
        return '0' + valStr;
    }
    return valStr;
}

function durationText(duration) {
    if (duration < 0) {
        return "Play";
    }
    let durationSecInt = Math.round(duration);
    return durationFormatSubVal(Math.floor(durationSecInt / 3600))
    + ":" + durationFormatSubVal(Math.floor((durationSecInt % 3600) / 60))
    + ":" + durationFormatSubVal(Math.floor(durationSecInt % 60));
}

const getMsTime = () => {
    return new Date().getTime();
};


/***************************************************
 *
 *
 *
 * 1. H.265/HEVC MP4/FLV/HLS/TS 
 * Demo for create player(MP4/FLV/HLS/TS)
 * 点播/直播播放器创建Demo(MP4/FLV/HLS/TS)
 *
 *
 *
 ***************************************************/
// clear cache count
function clear() {
    window.STATICE_MEM_playerCount = -1;
    window.STATICE_MEM_playerIndexPtr = 0;
}
clear();

window.onload = function() {
    //var token = "============>>>>>>>>>>>>>>Author:changyanlong|numberwolf,Github:https://github.com/numberwolf,Email:porschegt23@foxmail.com,QQ:531365872,HomePage:http://xvideo.video,Discord:numberwolf#8694,Beijing,WorkIn:Baidu<<<<<<<<<<<<===========";
    var token = "base64:QXV0aG9yOmNoYW5neWFubG9uZ3xudW1iZXJ3b2xmLEdpdGh1YjpodHRwczovL2dpdGh1Yi5jb20vbnVtYmVyd29sZixFbWFpbDpwb3JzY2hlZ3QyM0Bmb3htYWlsLmNvbSxRUTo1MzEzNjU4NzIsSG9tZVBhZ2U6aHR0cDovL3h2aWRlby52aWRlbyxEaXNjb3JkOm51bWJlcndvbGYjODY5NCx3ZWNoYXI6bnVtYmVyd29sZjExLEJlaWppbmcsV29ya0luOkJhaWR1";
    /******** Test Cases *******/
    var url = document.getElementById("div1").innerText;
    //var url = "res/hls/veilside.m3u8";
    //var url = "res/hls1/test.m3u8";
    //var url = "http://182.61.31.911:8080/live/livestream.flv";
    //var url = "http://127.0.0.1/live/test/hls.m3u8";

    /******** Websocket FLV/TS ********/
    // var url = "ws://127.0.0.1/live/test.flv";
    // var url = "ws://127.0.0.1/live/test.live.ts";

    /******** HTTP FLV/TS/HLS ********/
    // var url = "http://127.0.0.1/live/test.flv";
    // var url = "http://127.0.0.1/live/test.live.ts";
    // var url = "http://127.0.0.1/live/test/hls.m3u8";
    var config = {
        player: "glplayer",
        width: window.screen.width*0.8,
        height: window.screen.width*0.8*(9/16),
        token : token,
        extInfo : {
            coreProbePart : 0.4,
            probeSize : 8192,
            ignoreAudio : 0
        }
    }; // config
    var config2 = {
        player: "glplayer2",
        width: window.screen.width*0.95,
        height: window.screen.width*0.95*(9/16),
        token : token,
        extInfo : {
            coreProbePart : 0.4,
            probeSize : 8192,
            ignoreAudio : 0
        }
    }; // config2
    let playerId        = config.player;
    let playerId2       = config2.player;
    let playerObj       = window.new265webjs(url, config);
    let playerObj2       = window.new265webjs(url, config2);

    let playerDom       = document.querySelector('#' + playerId);
    let playerDom2       = document.querySelector('#' + playerId2);
    let playerCont      = document.querySelector('#player-container');
    let playerCont2      = document.querySelector('#player-container2');
    let controllerCont  = document.querySelector('#controller');
    let progressCont    = document.querySelector('#progress-contaniner');
    let progressContW   = progressCont.offsetWidth;
    let cachePts        = progressCont.querySelector('#cachePts');
    let progressPts     = progressCont.querySelector('#progressPts');
    let progressVoice   = document.querySelector('#progressVoice');
    let playBar         = document.querySelector('#playBar');
    let playBar2        = document.querySelector('#playBar2');
    let playBtn         = playBar.getElementsByTagName('a')[0];
    let playBtn2         = playBar2.getElementsByTagName('a')[0];
    let showLabel       = document.querySelector('#showLabel');
    let ptsLabel        = document.querySelector('#ptsLabel');
    let coverToast      = document.querySelector('#coverLayer');
    let coverBtn        = document.querySelector('#coverLayerBtn');
    let muteBtn         = document.querySelector('#muteBtn');
    // let debugYUVBtn     = document.querySelector('#debugYUVBtn');
    // let debugYUVATag    = document.querySelector('#debugYUVUrl');
    let fullScreenBtn   = document.querySelector('#fullScreenBtn');
    let mediaInfo       = null;

    playBtn.disabled    = true;
    // playBar.textContent = '>';
    showLabel.textContent = SHOW_LOADING;
    playerCont.style.width = config.width + 'px';
    playerCont.style.height = config.height + 'px';
    playerCont2.style.width = config2.width + 'px';
    playerCont2.style.height = config2.height + 'px';
    controllerCont.style.width = config.width + 'px';

    let muteState = false;

    // controllerCont.style.left = playerContainer.clientLeft;
    // controllerCont.style.bottom = playerContainer.clientBottom;
    // alert(playerContainer.clientLeft);

    let playAction = () => {
        console.log("is playing:", playerObj.isPlaying());
        if (playerObj.isPlaying()) {
            console.log("bar pause============>");
            // playBar.textContent = '>';
            playBar.setAttribute('class', 'playBtn');
            playerObj.pause();
        } else {
            // playBar.textContent = '||';
            playBar.setAttribute('class', 'pauseBtn');
            playerObj.play();
        }
        if (playerObj2.isPlaying()) {
            console.log("bar pause============>");
            // playBar.textContent = '>';
            playerObj2.pause();
        } else {
            // playBar.textContent = '||';
            playerObj2.play();
        }
    };

    playerCont.onmouseover = function() {
        controllerCont.hidden = false;
    };

    playerCont.onmouseout = function() {
        controllerCont.hidden = true;
    };

    playerDom.onmouseup = function() {
        playAction();
    };

    playBtn.onclick = () => {
        playAction();
    };

    muteBtn.onclick = () => {
        console.log(playerObj.getVolume());
        if (muteState === true) {
            playerObj.setVoice(1.0);
            progressVoice.value = 100;
        } else {
            playerObj.setVoice(0.0);
            progressVoice.value = 0;
        }
        muteState = !muteState;
    };

    fullScreenBtn.onclick = () => {
        playerObj.fullScreen();
        // setTimeout(() => {
        //     playerObj.closeFullScreen();
        // }, 2000);
    };

    progressCont.addEventListener('click', (e) => {
        showLabel.textContent = SHOW_LOADING;
        let x = e.pageX - progressCont.getBoundingClientRect().left; // or e.offsetX (less support, though)
        let y = e.pageY - progressCont.getBoundingClientRect().top;  // or e.offsetY
        let clickedValue = x * progressCont.max / progressCont.offsetWidth;
        // alert(clickedValue);
        playerObj.seek(clickedValue);
        playerObj2.seek(clickedValue);
    });

    progressVoice.addEventListener('click', (e) => {
        let x = e.pageX - progressVoice.getBoundingClientRect().left; // or e.offsetX (less support, though)
        let y = e.pageY - progressVoice.getBoundingClientRect().top;  // or e.offsetY
        let clickedValue = x * progressVoice.max / progressVoice.offsetWidth;
        progressVoice.value = clickedValue;
        let volume = clickedValue / 100;
        // alert(volume);
        // console.log(
        //     progressVoice.offsetLeft, // 209
        //     x, y, // 324 584
        //     progressVoice.max, progressVoice.offsetWidth);
        playerObj.setVoice(volume);
    });

    playerObj.onSeekStart = (pts) => {
        showLabel.textContent = SHOW_LOADING + " seek to:" + parseInt(pts);
    };

    playerObj.onSeekFinish = () => {
        showLabel.textContent = SHOW_DONE;
    };

    playerObj.onPlayFinish = () => {
        console.log("============= FINISHED ===============");
        // playBar.textContent = '>';
        playBar.setAttribute('class', 'playBtn');
        playBar2.setAttribute('class', 'playBtn');
        // playerObj.release();
        // console.log("=========> release ok");
    };

    playerObj.onRender = (width, height, imageBufferY, imageBufferB, imageBufferR) => {
        console.log("on render");
    };

    playerObj.onOpenFullScreen = () => {
        console.log("onOpenFullScreen");
    };

    playerObj.onCloseFullScreen = () => {
        console.log("onCloseFullScreen");
    };

    playerObj.onSeekFinish = () => {
        showLabel.textContent = SHOW_DONE;
    };

    playerObj.onLoadCache = () => {
        showLabel.textContent = "Caching...";
    };

    playerObj.onLoadCacheFinshed = () => {
        showLabel.textContent = SHOW_DONE;
    };

    playerObj.onReadyShowDone = () => {
        console.log("onReadyShowDone");
        showLabel.textContent = "Cover Img OK";
    };

    playerObj.onLoadFinish = () => {
        playerObj.setVoice(1.0);
        mediaInfo = playerObj.mediaInfo();
        console.log("mediaInfo===========>", mediaInfo);
        /*
        meta:
            durationMs: 144400
            fps: 25
            sampleRate: 44100
            size: {
                width: 864,
                height: 480
            },
            audioNone : false
        videoType: "vod"
        */
        if (mediaInfo.meta.isHEVC === false) {
            console.log("is not HEVC/H.265 media!");
            //coverToast.removeAttribute('hidden');
            //coverBtn.style.width = '100%';
            //coverBtn.style.fontSize = '50px';
            //coverBtn.innerHTML = 'is not HEVC/H.265 media!';
            //return;
        }
        //console.log("is HEVC/H.265 media.");

        playBtn.disabled = false;
        playBtn2.disabled = false;

        if (mediaInfo.meta.audioNone) {
            progressVoice.value = 0;
            progressVoice.style.display = 'none';
        } else {
            playerObj.setVoice(0.5);
            playerObj2.setVoice(0.0);
        }

        if (mediaInfo.videoType == "vod") {
            cachePts.max = mediaInfo.meta.durationMs / 1000;
            progressCont.max = mediaInfo.meta.durationMs / 1000;
            ptsLabel.textContent = durationText(0) + '/' + durationText(progressCont.max);
        } else {
            cachePts.hidden = true;
            progressCont.hidden = true;
            ptsLabel.textContent = 'LIVE';

            if (mediaInfo.meta.audioNone === true) {
                // playBar.textContent = '||';
                playerObj.play();
                playerObj2.play();
            } else {

                coverToast.removeAttribute('hidden');
                coverBtn.onclick = () => {
                    // playBar.textContent = '||';
                    playAction();
                    coverToast.setAttribute('hidden', 'hidden');
                };
            }

        }

        showLabel.textContent = SHOW_DONE;
    };

    playerObj.onCacheProcess = (cPts) => {
        // console.log("onCacheProcess => ", cPts);
        try {
            // cachePts.value = cPts;
            let precent = cPts / progressCont.max;
            let cacheWidth = precent * progressContW;
            // console.log(precent, precent * progressCont.offsetWidth);
            cachePts.style.width = cacheWidth + 'px';
        } catch(err) {
            console.log(err);
        }
    };

    playerObj.onPlayTime = (videoPTS) => {
        if (mediaInfo.videoType == "vod") {
            // progressPts.value = videoPTS;
            let precent = videoPTS / progressCont.max;
            let progWidth = precent * progressContW;
            // console.log(precent, precent * progressCont.offsetWidth);
            progressPts.style.width = progWidth + 'px';

            ptsLabel.textContent = durationText(videoPTS) + '/' + durationText(progressCont.max);
        } else {
            // ptsLabel.textContent = durationText(videoPTS) + '/LIVE';
            ptsLabel.textContent = '/LIVE';
        }
    };

    playerObj.do();
    playerObj2.do();
    return playerObj;
};


