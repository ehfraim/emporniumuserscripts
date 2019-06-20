// ==UserScript==
// @name         empornium change download icon on click
// @namespace    empornium
// @version      2
// @description  Change from blue arrow to yellow disk when downloading from torrent list page
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// ==/UserScript==

document.querySelectorAll('i.download').forEach(i => {
  i.addEventListener('click', changeIcon);
});

function changeIcon(e) {
  var icons = e.target.parentNode.querySelectorAll('.download');
  if (icons.length > 0) {
    icons[0].classList.add('grabbed', 'icon_torrent_disk');
    icons[0].classList.remove('download', 'icon_torrent_download');
    icons[1].classList.add('grabbed', 'icon_torrent_disk_inner');
    icons[1].classList.remove('download', 'icon_torrent_leeching');
  }
}
