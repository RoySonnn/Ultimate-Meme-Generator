'use strict'

function onInit() {
  initImgs()
  renderGallery()
  initMemeEditor()
}

function openMobileMenu() {
  var el = document.querySelector('.mobile-menu')
  if (el) el.classList.remove('hidden')
}

function closeMobileMenu() {
  var el = document.querySelector('.mobile-menu')
  if (el) el.classList.add('hidden')
}
