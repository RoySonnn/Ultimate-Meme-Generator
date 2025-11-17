'use strict'

var gSavedSelectedTags = []

function onShowSavedMemes() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.remove('hidden')

    var input = document.querySelector('.saved-tag-search-input')
    if (input) input.value = ''

    if (gSavedSelectedTags.length) {
        filterSavedByTags()
    } else {
        renderSavedMemes()
    }
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
    gMeme.savedIdx = idx
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

function getKeywordsForSavedMemes() {
    var memes = getSavedMemes()
    var set = new Set()

    memes.forEach(meme => {
        var img = getImgById(meme.selectedImgId)
        if (!img) return
        img.keywords.forEach(t => set.add(t))
    })

    return Array.from(set)
}

function renderSavedTagOptions(txt = '') {
    var elList = document.querySelector('.saved-tag-options')
    var tags = getKeywordsForSavedMemes()

    var finalTags = tags.filter(tag => !gSavedSelectedTags.includes(tag))

    txt = txt.toLowerCase().trim()
    if (txt) {
        finalTags = finalTags.filter(tag =>
            tag.toLowerCase().includes(txt)
        )
    }

    elList.innerHTML = finalTags
        .map(tag => `<li onclick="onSavedSelectTag('${tag}')">${tag}</li>`)
        .join('')
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

function onSavedToggleTagDropdown() {
    var box = document.querySelector('.saved-tag-dropdown')
    var inputVal = document.querySelector('.saved-tag-search-input').value || ''

    if (box.classList.contains('hidden')) {
        renderSavedTagOptions(inputVal)
        box.classList.remove('hidden')
    } else {
        box.classList.add('hidden')
    }
}


function onSavedSelectTag(tag) {
    if (!gSavedSelectedTags.includes(tag)) {
        gSavedSelectedTags.push(tag)
    }

    var input = document.querySelector('.saved-tag-search-input')
    if (input) input.value = ''

    renderSavedSelectedTags()
    filterSavedByTags()

    document.querySelector('.saved-tag-dropdown').classList.add('hidden')
}

function renderSavedSelectedTags() {
    var el = document.querySelector('.saved-selected-tags')
    el.innerHTML = gSavedSelectedTags
        .map(tag => `<div class="selected-tag">${tag}<button onclick="onSavedRemoveTag('${tag}')">✕</button></div>`)
        .join('')
}


function onSavedRemoveTag(tag) {
    gSavedSelectedTags = gSavedSelectedTags.filter(t => t !== tag)
    renderSavedSelectedTags()
    filterSavedByTags()
}


function filterSavedByTags() {
    var memes = getSavedMemes()

    if (!gSavedSelectedTags.length) {
        renderSavedMemes()
        return
    }

    var filtered = memes.filter(meme => {
        var img = getImgById(meme.selectedImgId)
        if (!img) return false
        return gSavedSelectedTags.every(tag => img.keywords.includes(tag))
    })

    renderSavedFiltered(filtered)
}


function onSavedLiveTagSearch(txt) {
    txt = txt.toLowerCase().trim()

    renderSavedTagOptions(txt)

    if (!txt) {
        filterSavedByTags()
        return
    }

    var base = getSavedMemes().filter(meme => {
        var img = getImgById(meme.selectedImgId)
        if (!img) return false
        return gSavedSelectedTags.every(tag => img.keywords.includes(tag))
    })

    var filtered = base.filter(meme => {
        var img = getImgById(meme.selectedImgId)
        if (!img) return false
        return img.keywords.some(keyword =>
            keyword.toLowerCase().includes(txt)
        )
    })

    renderSavedFiltered(filtered)
}


