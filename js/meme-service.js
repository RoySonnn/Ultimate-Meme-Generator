'use strict'

const SAVED_MEMES_KEY = 'savedMemes'
const IMG_KEYWORDS_KEY = 'imgKeywords'
var gImgs = []
var gMeme = createInitialMeme()
var gKeywordSearchCountMap = {}

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

var gDefaultKeywords = {
    1: ['President','Funny','Serious','Angry'],
    2: ['Dog','Funny', 'Cute'],
    3: ['Dog', 'Cute', 'Baby'],
    4: ['Cat', 'Funny', 'Cute'],
    5: ['Funny', 'Baby', 'Cute','Serious'],
    6: ['Funny','Serious', 'High'],
    7: ['Baby', 'Cute', 'Happy', 'Funny'],
    8: ['Happy', 'Funny'],
    9: ['Funny','Joyful','Bad'],
    10: ['President','Funny'],
    11: ['Serious','Weird','Funny'],
    12: ['Serious','Angry','Funny'],
    13: ['Happy', 'Funny'],
    14: ['Sad','Serious'],
    15: ['Sad','Serious','LOTR'],
    16: ['Funny','Weird','Star trek'],
    17: ['President','Funny','Serious','Angry'],
    18: ['Funny','Weird','Sad'],
}

function initImgs() {
    var stored = loadFromStorage(IMG_KEYWORDS_KEY) || {}
    gImgs = []
    gKeywordSearchCountMap = {}

    for (var i = 1; i <= 18; i++) {
        var tags = stored[i] && stored[i].length ? stored[i] : gDefaultKeywords[i] || []
        gImgs.push({
            id: i,
            url: 'meme-imgs/meme-imgs (square)/' + i + '.jpg',
            keywords: [...tags]
        })
        tags.forEach(tag => gKeywordSearchCountMap[tag] = true)
    }
}

function saveKeywordsToStorage() {
    var db = {}
    gImgs.forEach(img => db[img.id] = img.keywords)
    saveToStorage(IMG_KEYWORDS_KEY, db)
}

function getMeme() {
    return gMeme
}

function getImgById(id) {
    return gImgs.find(img => img.id === id)
}

function getKeywordsForImg(imgId) {
    var img = getImgById(imgId)
    return img ? img.keywords : []
}

function setImg(id) {
    gMeme.selectedImgId = id
    gMeme.savedIdx = -1
}

function setSelectedLine(idx) {
    if (idx < 0 || idx >= gMeme.lines.length) return
    gMeme.selectedLineIdx = idx
    gMeme.isLineSelected = true
}

function addTagToImg(imgId, tag) {
    tag = tag.trim().toLowerCase()
    if (!tag) return
    var img = getImgById(imgId)
    if (!img) return
    if (!img.keywords.includes(tag)) {
        img.keywords.push(tag)
        saveKeywordsToStorage()
    }
}

function deleteTagFromImg(imgId, tag) {
    var img = getImgById(imgId)
    if (!img) return
    img.keywords = img.keywords.filter(t => t !== tag)
    saveKeywordsToStorage()
}

function setLineTxt(txt) {
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
    line.size += diff
    if (line.size < 8) line.size = 8
}

function addLine() {
    var y = gMeme.lines.length === 0 ? 80 :
        gMeme.lines.length === 1 ? 420 : 250

    gMeme.lines.push({
        txt: '',
        size: 36,
        color: '#ff0000',
        strokeColor: '#000000',
        font: 'Arial',
        align: 'center',
        x: 250,
        y
    })

    gMeme.selectedLineIdx = gMeme.lines.length - 1
    gMeme.isLineSelected = true
}

function switchLine() {
    gMeme.selectedLineIdx++
    if (gMeme.selectedLineIdx >= gMeme.lines.length) gMeme.selectedLineIdx = 0
    gMeme.isLineSelected = true
}

function deleteLine() {
    gMeme.lines.splice(gMeme.selectedLineIdx, 1)

    if (gMeme.lines.length === 0) {
        gMeme.selectedLineIdx = -1
        gMeme.isLineSelected = false
        return
    }

    if (gMeme.selectedLineIdx >= gMeme.lines.length) {
        gMeme.selectedLineIdx = gMeme.lines.length - 1
    }

    gMeme.isLineSelected = true
}

function saveMemeToStorage() {
    var meme = JSON.parse(JSON.stringify(gMeme))
    meme.savedImg = gElCanvas.toDataURL('image/png')
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    var idx = memes.length
    meme.savedIdx = idx
    gMeme.savedIdx = idx
    memes.push(meme)
    saveToStorage(SAVED_MEMES_KEY, memes)
}

function overwriteSavedMeme(idx) {
    var memes = loadFromStorage(SAVED_MEMES_KEY) || []
    if (idx < 0 || idx >= memes.length) return saveMemeToStorage()
    var meme = JSON.parse(JSON.stringify(gMeme))
    meme.savedImg = gElCanvas.toDataURL('image/png')
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
}

function saveToStorage(key, val) {
    localStorage.setItem(key, JSON.stringify(val))
}

function loadFromStorage(key) {
    return JSON.parse(localStorage.getItem(key))
}
