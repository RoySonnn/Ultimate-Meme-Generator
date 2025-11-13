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
        return '<img src="' + src + '" class="gallery-img" onclick="onLoadSavedMeme(' + idx + ')">'
    }).join('')
    el.innerHTML = html
}

function onLoadSavedMeme(idx) {
    var saved = getSavedMemes()
    var meme = saved[idx]
    loadMeme(meme)
    document.querySelector('.saved-memes').classList.add('hidden')
    document.querySelector('.editor').classList.remove('hidden')
    updateEditorInputs()
    renderMeme()
}
