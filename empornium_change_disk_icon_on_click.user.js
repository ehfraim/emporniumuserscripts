// ==UserScript==
// @name         empornium change disk icon on click
// @namespace    empornium
// @version      1
// @description  Change from blue disk to yellow disk when downloading from torrent list page
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('.icon_disk_none').forEach(i => {
  i.addEventListener('click', changeIcon);
});

function changeIcon(e) {
  if (e.target.classList.contains('icon_disk_none')) {
    e.target.classList.add('icon_disk_grabbed');
    e.target.classList.remove('icon_disk_none')
  }
}