// ==UserScript==
// @name         www.nhk.or.jp video fix
// @namespace    https://github.com/CherryPerry/userscript-www.nhk.or.jp/
// @version      1.3
// @description  Video player fixes for www.nhk.or.jp
// @author       CherryPerry @ GitHub
// @match        https://www.nhk.or.jp/*
// @match        https://www2.nhk.or.jp/*
// @grant        none
// @icon         https://www.nhk.or.jp/favicon.ico
// @updateURL    https://raw.github.com/CherryPerry/userscript-www.nhk.or.jp/master/userscript.user.js
// ==/UserScript==

(function() {
    'use strict';
    
    // Sample: TODO

    let findPlayerContainerV1 = function () {
        return document.querySelector('#app-movie-player > div')
    }
    
    let fixPlayerWidthV1 = function () {
        let root = findPlayerContainerV1()
        root.style.width = '90%'
        root.querySelector('div.clmleft').style.width = '80%'
        root.querySelector('div.clmright').style.width = '20%'
    }
    
    // Smaple: https://www2.nhk.or.jp/school/movie/clip.cgi?das_id=D0005330019_00000&p=box
    
    let findPlayerContainerV2 = function () {
        return document.querySelector('#movie > div')
    }
    
    let fixPlayerWidthV2 = function () {
        let root = findPlayerContainerV2()
        root.style.width = '90%'
        root.querySelector('div.clmleft').style.width = '80%'
        root.querySelector('div.clmright').style.width = '20%'
    }
    
    // Player controls

    let findPlayer = function () {
        return document.querySelector('#schoolVideoPlayer')
    }

    let controlPlayerWithKeys = function () {
        let player = findPlayer()
        document.addEventListener('keydown', event => {
            if (event.code === 'Space') {
                event.preventDefault()
                if (player.paused) {
                    player.play()
                } else {
                    player.pause()
                }
            } else {
                switch (event.key) {
                    case 'ArrowLeft':
                        event.preventDefault()
                        player.currentTime = Math.max(0, player.currentTime - 1)
                        break
                    case 'ArrowRight':
                        event.preventDefault()
                        player.currentTime = Math.min(player.duration, player.currentTime + 1)
                }
            }
        })
    }
    
    // Initialization

    let waitForElementAndInitialize = function (elementLocator, initializer) {
        let callback = function (mutationsList, observer) {
            if (mutationsList.find((mutation) => mutation.type === 'childList') != null) {
                if (elementLocator() != null) {
                    observer.disconnect();
                    initializer()
                    return
                }
            }
        };

        let observer = new MutationObserver(callback);
        let config = {
            childList: true,
            subtree: true
        };
        observer.observe(document, config);
    }

    waitForElementAndInitialize(findPlayerContainerV1, fixPlayerWidth)
    waitForElementAndInitialize(findPlayer, controlPlayerWithKeys)
})();
