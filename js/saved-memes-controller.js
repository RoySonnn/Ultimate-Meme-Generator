'use strict'

function onShowSavedMemes() {
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

    var html = saved.map(function (meme, idx) {
        var src = meme.savedImg
        if (!src) {
            var img = getImgById(meme.selectedImgId)
            if (img) src = img.url
        }

        return `
            <div class="saved-item">
                <img src="${src}" class="gallery-img" onclick="onLoadSavedMeme(${idx})">
                <button class="saved-delete-btn" onclick="onDeleteSavedMeme(${idx})">✕</button>
            </div>
        `
    }).join('')

    el.innerHTML = html
}


function onLoadSavedMeme(idx) {
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
    renderSavedMemes()
}


function saveKeywordsToStorage() {
    var map = {}
    gImgs.forEach(img => map[img.id] = img.keywords)
    saveToStorage(IMG_KEYWORDS_KEY, map)
}
