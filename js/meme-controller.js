'use strict'

var gElCanvas
var gCtx

function initMemeEditor() {
    gElCanvas = document.querySelector('#meme-canvas')
    if (!gElCanvas) return
    gCtx = gElCanvas.getContext('2d')
    gElCanvas.addEventListener('click', onCanvasClick)
}

function renderMeme() {
    var meme = getMeme()
    var img = getImgById(meme.selectedImgId)
    if (!gElCanvas || !gCtx || !img) return

    var elImg = new Image()
    elImg.src = img.url
    elImg.onload = function () {
        gElCanvas.width = elImg.width
        gElCanvas.height = elImg.height
        gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
        gCtx.drawImage(elImg, 0, 0, gElCanvas.width, gElCanvas.height)

        meme.lines.forEach(function (line, idx) {
            var font = line.font || 'Impact'
            var align = line.align || 'center'
            var strokeColor = line.strokeColor || '#000000'

            gCtx.lineWidth = 2
            gCtx.font = line.size + 'px ' + font
            gCtx.textAlign = align
            gCtx.textBaseline = 'middle'
            gCtx.fillStyle = line.color
            gCtx.strokeStyle = strokeColor

            gCtx.fillText(line.txt, line.x, line.y)
            gCtx.strokeText(line.txt, line.x, line.y)

            if (idx === meme.selectedLineIdx) {
                var metrics = gCtx.measureText(line.txt)
                var width = metrics.width
                var xStart = line.x
                if (align === 'center') xStart = line.x - width / 2
                else if (align === 'right') xStart = line.x - width

                var padding = 8
                var rectX = xStart - padding
                var rectY = line.y - line.size / 2 - padding
                var rectW = width + padding * 2
                var rectH = line.size + padding * 2

                gCtx.strokeStyle = 'blue'
                gCtx.strokeRect(rectX, rectY, rectW, rectH)
            }
        })
    }
}

function updateEditorInputs() {
    var meme = getMeme()
    var line = meme.lines[meme.selectedLineIdx]
    if (!line) return

    var elTextInput = document.querySelector('.text-input')
    var colorInputs = document.querySelectorAll('.color-picker input[type="color"]')
    var elFontSelect = document.querySelector('.font-row select')
    var elLineIndex = document.querySelector('#line-index')
    var elLineCount = document.querySelector('#line-count')

    if (elTextInput) elTextInput.value = line.txt
    if (colorInputs[0]) colorInputs[0].value = line.color
    if (colorInputs[1]) colorInputs[1].value = line.strokeColor || '#000000'
    if (elFontSelect) elFontSelect.value = line.font || 'Impact'
    if (elLineIndex) elLineIndex.textContent = meme.selectedLineIdx + 1
    if (elLineCount) elLineCount.textContent = meme.lines.length

    if (elTextInput) elTextInput.focus()
}

function onSetLineTxt(txt) {
    setLineTxt(txt)
    renderMeme()
}

function onSetColor(color) {
    setLineColor(color)
    renderMeme()
}

function onSetStrokeColor(color) {
    setStrokeColor(color)
    renderMeme()
}

function onSetFont(font) {
    setFont(font)
    renderMeme()
}

function onSetAlign(align) {
    setAlign(align)
    renderMeme()
}

function onDownloadMeme() {
    if (!gElCanvas) return
    var link = document.createElement('a')
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

function onDeleteLine() {
    deleteLine()
    updateEditorInputs()
    renderMeme()
}

function onCanvasClick(ev) {
    var meme = getMeme()
    if (!gElCanvas || !gCtx) return

    var rect = gElCanvas.getBoundingClientRect()
    var x = ev.clientX - rect.left
    var y = ev.clientY - rect.top

    var clickedIdx = -1

    for (var i = meme.lines.length - 1; i >= 0; i--) {
        var line = meme.lines[i]
        var font = line.font || 'Impact'
        var align = line.align || 'center'

        gCtx.font = line.size + 'px ' + font
        gCtx.textAlign = align
        gCtx.textBaseline = 'middle'

        var metrics = gCtx.measureText(line.txt)
        var width = metrics.width
        var xStart = line.x
        if (align === 'center') xStart = line.x - width / 2
        else if (align === 'right') xStart = line.x - width

        var padding = 8
        var left = xStart - padding
        var right = xStart + width + padding
        var top = line.y - line.size / 2 - padding
        var bottom = line.y + line.size / 2 + padding

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
