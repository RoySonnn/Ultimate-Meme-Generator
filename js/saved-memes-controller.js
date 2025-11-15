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

    el.innerHTML = saved.map(getSavedMemeHTML).join('')
}

function getSavedMemeHTML(meme) {
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
}

function onLoadSavedMeme(idx) {
    gLastScreen = 'saved'
    document.querySelector('.btn-back.inline').textContent = 'Back to Memes'
    clearAllSearchInputs()
    var saved = getSavedMemes()
    var meme = saved[idx]
    loadMeme(meme)
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
    saveToStorage(SAVED_MEMES_KEY, memes)
    fixSavedIndexes()
    renderSavedMemes()
}

function onSearchSaved(ev) {
    var txt = ev.target.value.toLowerCase().trim()
    var memes = getSavedMemes()

    if (!txt) {
        renderSavedMemes()
        return
    }

    var filtered = memes.filter(function (meme) {
        var matchText = meme.lines.some(function (line) {
            return line.txt.toLowerCase().includes(txt)
        })

        var img = getImgById(meme.selectedImgId)
        var matchTag = img && img.keywords.some(function (keyword) {
            return keyword.toLowerCase().includes(txt)
        })

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

    el.innerHTML = memes.map(getSavedMemeHTML).join('')
}

function fixSavedIndexes() {
    var memes = getSavedMemes()
    memes.forEach(function (m, i) {
        m.savedIdx = i
    })
    saveToStorage(SAVED_MEMES_KEY, memes)
}
