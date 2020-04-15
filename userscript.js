// ==UserScript==
// @name         New Userscript
// @namespace    https://github.com/CherryPerry/userscript-www.nhk.or.jp/
// @version      1.0
// @author       CherryPerry @ GitHub
// @match        https://www.nhk.or.jp/*
// @grant        none
// @updateURL    https://raw.github.com/CherryPerry/userscript-www.nhk.or.jp/master/userscript.js
// ==/UserScript==

(function() {
    'use strict';

    const findPlayerContainer = function () {
        return document.querySelector('#app-movie-player > div')
    }

    const findPlayer = function () {
        return document.querySelector('#schoolVideoPlayer')
    }

    const fixPlayerWidth = function () {
        document.querySelector('#app-movie-player > div').style.width = '90%'
        document.querySelector('#app-movie-player > div > div.clmleft').style.width = '80%'
        document.querySelector('#app-movie-player > div > div.clmright').style.width = '20%'
    }

    const controlPlayerWithKeys = function () {
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

    const waitForElementAndInitialize = function (elementLocator, initializer) {
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

    waitForElementAndInitialize(findPlayerContainer, fixPlayerWidth)
    waitForElementAndInitialize(findPlayer, controlPlayerWithKeys)
})();
