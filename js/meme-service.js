'use strict'

var SAVED_MEMES_KEY = 'savedMemes'
var gImgs = []

function initImgs() {
    for (var i = 1; i <= 18; i++) {
        gImgs.push({
            id: i,
            url: 'meme-imgs/meme-imgs (square)/' + i + '.jpg',
            keywords: []
        })
    }
}

var gMeme = {
    selectedImgId: 1,
    selectedLineIdx: 0,
    isLineSelected: true,
    savedIdx: null,
    lines: [
        {
            txt: 'I sometimes eat Falafel',
            size: 30,
            color: '#000000ff',
            strokeColor: '#ff0000',
            font: 'Comic Sans MS',
            align: 'center',
            x: 250,
            y: 60
        }
    ]
}

var gKeywordSearchCountMap = { funny: 12, cat: 16, baby: 2 }

function getMeme() {
    return gMeme
}

function getImgById(imgId) {
    return gImgs.find(function (img) { return img.id === imgId })
}

function setLineTxt(txt) {
    gMeme.lines[gMeme.selectedLineIdx].txt = txt
}

function setImg(imgId) {
    gMeme.selectedImgId = imgId
    gMeme.savedIdx = null
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

function setAlign(align) {
    gMeme.lines[gMeme.selectedLineIdx].align = align
}

function changeFontSize(diff) {
    gMeme.lines[gMeme.selectedLineIdx].size += diff
}

function addLine() {
    var linesCount = gMeme.lines.length
    var x = 250
    var y
    if (linesCount === 0) y = 60
    else if (linesCount === 1) y = 500 - 60
    else y = 500 / 2
    gMeme.lines.push({
        txt: '',
        size: 30,
        color: '#000000ff',
        strokeColor: '#ff0000ff',
        font: 'Comic Sans MS',
        align: 'center',
        x: x,
        y: y
    })
    gMeme.selectedLineIdx = gMeme.lines.length - 1
}

function switchLine() {
    if (!gMeme.lines.length) return
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
}

function deleteLine() {
    if (!gMeme.lines.length) return
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)
    if (!gMeme.lines.length) {
        gMeme.lines.push({
            txt: '',
            size: 30,
            color: '#000000ff',
            strokeColor: '#ff0000ff',
            font: 'Comic Sans MS',
            align: 'center',
            x: 250,
            y: 60
        })
        gMeme.selectedLineIdx = 0
        return
    }
    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
    }
}

function setSelectedLine(idx) {
    gMeme.selectedLineIdx = idx
}

function buildMemeForSave() {
    var memeCopy = JSON.parse(JSON.stringify(gMeme))
    if (window.gElCanvas) {
        try {
            memeCopy.savedImg = gElCanvas.toDataURL('image/png')
        } catch (e) { }
    }
    memeCopy.savedIdx = null
    return memeCopy
}

function saveMemeToStorage() {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    memes.push(buildMemeForSave())
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function overwriteSavedMeme(idx) {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    if (typeof idx !== 'number' || idx < 0 || idx >= memes.length) {
        memes.push(buildMemeForSave())
    } else {
        memes[idx] = buildMemeForSave()
    }
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function getSavedMemes() {
    return loadFromStorage(SAVED_MEMES_KEY) || []
}

function loadMeme(meme, idx) {
    gMeme = JSON.parse(JSON.stringify(meme))
    gMeme.savedIdx = (typeof idx === 'number') ? idx : null
}

function deleteSavedMeme(idx) {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    if (idx < 0 || idx >= memes.length) return
    memes.splice(idx, 1)
    saveToStorage(SAVED_MEMES_KEY, memes)
}


function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

function loadFromStorage(key) {
    var str = localStorage.getItem(key)
    if (!str) return null
    return JSON.parse(str)
}
