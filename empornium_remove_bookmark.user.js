// ==UserScript==
// @name         empornium remove bookmark
// @namespace    https://www.empornium.me/
// @version      1
// @description  Click on bookmark star in torrent list to remove bookmark
// @author       ephraim
// @include      https://www.empornium.tld/*
// @grant        none
// ==/UserScript==

var bookmarks = document.querySelectorAll('img[src="static/styles/modern/images/star16.png"]')

for (var bookmark of bookmarks) {
  bookmark.style.cursor = 'pointer';
  var torrent = bookmark.parentNode.querySelector('a');
  var torrentId = torrent.href.match(/id=([\w\d]*)/)[1];
  var auth = torrent.href.match(/authkey=([\w\d]*)/)[1];

  var params = {
    action: "remove",
    type: "torrent",
    auth: auth,
    id: torrentId
  }

  bookmark.dataset.query = Object.keys(params).map((key) => {
      return encodeURIComponent(key) + '=' + encodeURIComponent(params[key])
  }).join('&');

  bookmark.addEventListener('click', e => {
    fetch('bookmarks.php?' + e.target.dataset.query, {credentials: 'include'})
    .then(e.target.remove());
  }, false);
}