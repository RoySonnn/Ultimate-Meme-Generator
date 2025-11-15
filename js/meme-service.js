'use strict'

var SAVED_MEMES_KEY = 'savedMemes'
var gImgs = []
var gMeme = createInitialMeme()

function createInitialMeme() {
    return {
        selectedImgId: 1,
        selectedLineIdx: 0,
        isLineSelected: true,
        savedIdx: -1,
        lines: [
            {
                txt: 'Your text here',
                size: 22,
                color: '#ff0000',
                strokeColor: '#000000',
                font: 'Arial',
                align: 'center',
                x: 250,
                y: 80
            }
        ]
    }
}

function initImgs() {
    gImgs = []
    for (var i = 1; i <= 18; i++) {
        gImgs.push({
            id: i,
            url: 'meme-imgs/meme-imgs (square)/' + i + '.jpg',
            keywords: []
        })
    }
}

function getMeme() {
    return gMeme
}

function getImgById(imgId) {
    return gImgs.find(function (img) {
        return img.id === imgId
    })
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.savedIdx = -1
}

function setLineTxt(txt) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setLineColor(color) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setStrokeColor(color) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setFont(font) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function setAlign(align) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function changeFontSize(diff) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].size += diff
    if (gMeme.lines[gMeme.selectedLineIdx].size < 8) {
        gMeme.lines[gMeme.selectedLineIdx].size = 8
    }
}

function addLine() {
    var linesCount = gMeme.lines.length
    var x = 250
    var y
    if (linesCount === 0) y = 80
    else if (linesCount === 1) y = 420
    else y = 250

    gMeme.lines.push({
        txt: '',
        size: 36,
        color: '#ff0000',
        strokeColor: '#000000',
        font: 'Arial',
        align: 'center',
        x: x,
        y: y
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
    gMeme.isLineSelected = true
}

function switchLine() {
    if (!gMeme.lines.length) return
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = 0
    }
    gMeme.isLineSelected = true
}

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)

    if (!gMeme.lines.length) {
        gMeme = createInitialMeme()
        return
    }

    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
    }
    gMeme.isLineSelected = true
}

function setSelectedLine(idx) {
    if (idx < 0 || idx >= gMeme.lines.length) return
    gMeme.selectedLineIdx = idx
    gMeme.isLineSelected = true
}

function saveMemeToStorage() {
    var memeCopy = JSON.parse(JSON.stringify(gMeme))
    if (window.gElCanvas) {
        try {
            memeCopy.savedImg = gElCanvas.toDataURL('image/png')
        } catch (e) { }
    }

    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    var idx = memes.length
    memeCopy.savedIdx = idx
    gMeme.savedIdx = idx
    memes.push(memeCopy)
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function overwriteSavedMeme(idx) {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    if (idx < 0 || idx >= memes.length) {
        saveMemeToStorage()
        return
    }

    var memeCopy = JSON.parse(JSON.stringify(gMeme))
    if (window.gElCanvas) {
        try {
            memeCopy.savedImg = gElCanvas.toDataURL('image/png')
        } catch (e) { }
    }

    memeCopy.savedIdx = idx
    gMeme.savedIdx = idx
    memes[idx] = memeCopy
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function getSavedMemes() {
    return loadFromStorage(SAVED_MEMES_KEY) || []
}

function loadMeme(meme) {
    gMeme = JSON.parse(JSON.stringify(meme))
    if (typeof gMeme.savedIdx !== 'number') gMeme.savedIdx = -1
    if (!gMeme.lines || !gMeme.lines.length) {
        gMeme.lines = createInitialMeme().lines
        gMeme.selectedLineIdx = 0
    }
}

function resetMemeDataToInitial() {
    var imgId = gMeme.selectedImgId || 1
    gMeme = createInitialMeme()
    gMeme.selectedImgId = imgId
}

function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    var str = localStorage.getItem(key)
    if (!str) return null
    return JSON.parse(str)
}
