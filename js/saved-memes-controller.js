'use strict'

function onShowSavedMemes() {
    clearAllSearchInputs()
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.remove('hidden')
    renderSavedMemes()
}

function renderSavedMemes() {
    var saved = getSavedMemes()
    var el = document.querySelector('.saved-grid')

    if (!saved.length) {
        el.innerHTML = '<p>No saved memes yet.</p>'
        return
    }

    var html = saved.map(function (meme) {
        var src = meme.savedImg
        if (!src) {
            var img = getImgById(meme.selectedImgId)
            if (img) src = img.url
        }

        return `
            <div class="saved-item">
                <img src="${src}" class="gallery-img" onclick="onLoadSavedMeme(${meme.savedIdx})">
                <button class="saved-delete-btn" onclick="onDeleteSavedMeme(${meme.savedIdx})">✕</button>
            </div>
        `
    }).join('')

    el.innerHTML = html
}



function onLoadSavedMeme(idx) {
    gLastScreen = 'saved'
    document.querySelector('.btn-back.inline').textContent = 'Back to Memes'
    clearAllSearchInputs()
    var saved = getSavedMemes()
    var meme = saved[idx]
    loadMeme(meme, idx)
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    updateEditorInputs()
    updateSaveCopyVisibility()
    renderMeme()
    renderTags()
}




function onDeleteSavedMeme(idx) {
    if (!confirm('Delete this meme?')) return

    var memes = getSavedMemes()
    memes.splice(idx, 1)
    saveToStorage('savedMemes', memes)
    fixSavedIndexes()
    renderSavedMemes()
}


function saveKeywordsToStorage() {
    var map = {}
    gImgs.forEach(img => map[img.id] = img.keywords)
    saveToStorage(IMG_KEYWORDS_KEY, map)
}


function onSearchSaved(ev) {
    var txt = ev.target.value.toLowerCase().trim()
    var memes = getSavedMemes()

    if (!txt) {
        renderSavedMemes()
        return
    }

    var filtered = memes.filter(function (meme) {
        var matchText = meme.lines.some(line =>
            line.txt.toLowerCase().includes(txt)
        )

        var img = getImgById(meme.selectedImgId)
        var matchTag = img && img.keywords.some(keyword =>
            keyword.toLowerCase().includes(txt)
        )

        return matchText || matchTag
    })

    renderSavedFiltered(filtered)
}

function renderSavedFiltered(memes) {
    var el = document.querySelector('.saved-grid')

    if (!memes.length) {
        el.innerHTML = '<p>No saved memes match your search.</p>'
        return
    }

    var html = memes.map(function (meme) {
        var src = meme.savedImg || getImgById(meme.selectedImgId).url

        return `
            <div class="saved-item">
                <img src="${src}" class="gallery-img" onclick="onLoadSavedMeme(${meme.savedIdx})">
                <button class="saved-delete-btn" onclick="onDeleteSavedMeme(${meme.savedIdx})">✕</button>
            </div>
        `
    }).join('')

    el.innerHTML = html
}


function onBackToSaved() {
    clearAllSearchInputs()
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.remove('hidden')
    renderSavedMemes()
}


function fixSavedIndexes() {
    var memes = getSavedMemes()
    memes.forEach((m, i) => m.savedIdx = i)
    saveToStorage('savedMemes', memes)
}
