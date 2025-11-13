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



    const elImg = new Image()
    elImg.src = img.url
    elImg.onload = () => {
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        meme.lines.forEach((line, idx) => {
            gCtx.font = `${line.size}px Impact`
            gCtx.fillStyle = line.color
            gCtx.strokeStyle = 'black'
            gCtx.textAlign = 'center'
            gCtx.fillText(line.txt, gElCanvas.width / 2, 60 + idx * 40)
            gCtx.strokeText(line.txt, gElCanvas.width / 2, 60 + idx * 40)

            if (idx === meme.selectedLineIdx) {
                const width = gCtx.measureText(line.txt).width
                gCtx.strokeStyle = 'blue'
                gCtx.strokeRect(
                    gElCanvas.width / 2 - width / 2 - 5,
                    60 + idx * 40 - line.size,
                    width + 10,
                    line.size + 10
                )
            }
        })
    }


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
    renderMeme()
}

function onSwitchLine() {
    switchLine()
    renderMeme()
}


