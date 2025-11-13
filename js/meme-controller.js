'use strict'

var gElCanvas
var gCtx

function renderMeme() {
    const meme = getMeme()
    const img = getImgById(meme.selectedImgId)

    gElCanvas = document.createElement('canvas')
    gElCanvas.width = 500
    gElCanvas.height = 500
    gCtx = gElCanvas.getContext('2d')

    const elEditor = document.querySelector('.editor')
    const elCanvasContainer = document.createElement('div')
    elCanvasContainer.classList.add('canvas-container')
    elCanvasContainer.appendChild(gElCanvas)

    elEditor.querySelector('.canvas-container')?.remove()
    elEditor.appendChild(elCanvasContainer)

    gElCanvas.addEventListener('click', onCanvasClick)

    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        const memeNow = getMeme()

        memeNow.lines.forEach((line, idx) => {
            gCtx.font = `${line.size}px Impact`
            gCtx.fillStyle = line.color
            gCtx.strokeStyle = 'black'
            gCtx.textAlign = 'center'
            gCtx.fillText(line.txt, line.x, line.y)
            gCtx.strokeText(line.txt, line.x, line.y)

            if (idx === memeNow.selectedLineIdx) {
                const width = gCtx.measureText(line.txt).width
                const left = line.x - width / 2 - 5
                const top = line.y - line.size
                const rectWidth = width + 10
                const rectHeight = line.size + 10
                gCtx.strokeStyle = 'blue'
                gCtx.strokeRect(left, top, rectWidth, rectHeight)
            }
        })
    }
}


function updateEditorInputs() {
    const meme = getMeme()
    const line = meme.lines[meme.selectedLineIdx]

    const elTextInput = document.querySelector('.text-input')
    const elColorInput = document.querySelector('.color-input')

    elTextInput.value = line.txt
    elColorInput.value = line.color

    elTextInput.focus()
}



function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetColor(color) {
    setLineColor(color)
    renderMeme()
}

function onDownloadMeme() {
    const link = document.createElement('a')
    link.download = 'meme.png'
    link.href = gElCanvas.toDataURL('image/png')
    link.click()
}

function onChangeFontSize(diff) {
    changeFontSize(diff)
    renderMeme()
}

function onAddLine() {
    addLine()
    updateEditorInputs()
    renderMeme()
}



function onSwitchLine() {
    switchLine()
    updateEditorInputs()
    renderMeme()
}



function onCanvasClick(ev) {
    const meme = getMeme()
    if (!gElCanvas || !gCtx) return

    const rect = gElCanvas.getBoundingClientRect()
    const x = ev.offsetX !== undefined ? ev.offsetX : ev.clientX - rect.left
    const y = ev.offsetY !== undefined ? ev.offsetY : ev.clientY - rect.top

    let clickedIdx = -1

    for (var i = meme.lines.length - 1; i >= 0; i--) {
        const line = meme.lines[i]
        gCtx.font = `${line.size}px Impact`
        const width = gCtx.measureText(line.txt).width
        const left = line.x - width / 2 - 5
        const right = line.x + width / 2 + 5
        const top = line.y - line.size
        const bottom = line.y + 10

        if (x >= left && x <= right && y >= top && y <= bottom) {
            clickedIdx = i
            break
        }
    }

    if (clickedIdx === -1) return
    setSelectedLine(clickedIdx)
    updateEditorInputs()
    renderMeme()
}
