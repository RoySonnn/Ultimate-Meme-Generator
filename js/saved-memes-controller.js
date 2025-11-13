'use strict'

function onShowSavedMemes() {
    document.querySelector('.gallery').classList.add('hidden')
    document.querySelector('.editor').classList.add('hidden')
    document.querySelector('.saved-memes').classList.remove('hidden')

    renderSavedMemes()
}

function renderSavedMemes() {
    const saved = getSavedMemes()
    const el = document.querySelector('.saved-memes')

    if (!saved.length) {
        el.innerHTML = `
            <button class="btn-back" onclick="onBackToGallery()">Back to Gallery</button>
            <p>No saved memes yet.</p>
        `
        return
    }

    let html = `<button class="btn-back" onclick="onBackToGallery()">Back to Gallery</button>`

    html += saved
        .map((meme, idx) => {
            return `
    <img
        src="${meme.savedImg}"
        class="gallery-img"
        onclick="onLoadSavedMeme(${idx})"
    >
`

        })
        .join('')

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

