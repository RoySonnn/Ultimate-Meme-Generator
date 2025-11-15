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

var gKeywordSearchCountMap = {
    funny: 12,
    cat: 16,
    baby: 2
}


function getMeme() {
    return gMeme
}

function getImgById(id) {
    return gImgs.find(img => img.id === id)
}

function setImg(id) {
    gMeme.selectedImgId = id
    gMeme.savedIdx = -1
}

function setLineTxt(txt) {
    if (!gMeme.lines.length) return
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setLineColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].color = color
}

function setStrokeColor(color) {
    gMeme.lines[gMeme.selectedLineIdx].strokeColor = color
}

function setFont(font) {
    gMeme.lines[gMeme.selectedLineIdx].font = font
}

function changeFontSize(diff) {
    var line = gMeme.lines[gMeme.selectedLineIdx]
    if (!line) return
    line.size += diff
    if (line.size < 8) line.size = 8
}

function addLine() {
    var x = 250
    var y = gMeme.lines.length === 0 ? 80 :
        gMeme.lines.length === 1 ? 420 : 250

    gMeme.lines.push({
        txt: '',
        size: 36,
        color: '#ff0000',
        strokeColor: '#000000',
        font: 'Arial',
        align: 'center',
        x,
        y
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
        gMeme.lines.push({
            txt: '',
            size: gEditorDefaults.size,
            color: gEditorDefaults.color,
            strokeColor: gEditorDefaults.strokeColor,
            font: gEditorDefaults.font,
            align: 'center',
            x: 250,
            y: 80
        })
        gMeme.selectedLineIdx = 0
        gMeme.isLineSelected = true
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
    var meme = JSON.parse(JSON.stringify(gMeme))
    if (window.gElCanvas) {
        try {
            meme.savedImg = gElCanvas.toDataURL('image/png')
        } catch (e) { }
    }

    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    var idx = memes.length

    meme.savedIdx = idx
    gMeme.savedIdx = idx

    memes.push(meme)
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function overwriteSavedMeme(idx) {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    if (idx < 0 || idx >= memes.length) {
        saveMemeToStorage()
        return
    }

    var meme = JSON.parse(JSON.stringify(gMeme))
    if (window.gElCanvas) {
        try {
            meme.savedImg = gElCanvas.toDataURL('image/png')
        } catch (e) { }
    }

    meme.savedIdx = idx
    gMeme.savedIdx = idx

    memes[idx] = meme
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
    var id = gMeme.selectedImgId || 1
    gMeme = createInitialMeme()
    gMeme.selectedImgId = id
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    var str = localStorage.getItem(key)
    if (!str) return null
    return JSON.parse(str)
}
