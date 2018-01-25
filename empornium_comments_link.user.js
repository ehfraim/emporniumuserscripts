// ==UserScript==
// @name        empornium link to comments
// @namespace   none
// @description Make comment number in torrent table a link to the comment section
// @include     https://www.empornium.me/torrents.php*
// @version     1
// @grant       none
// ==/UserScript==

var torrentRows = document.querySelectorAll('.torrent');
for (var row of torrentRows) {
  var link = row.querySelector('a[href^="/torrents.php?id="]');
  var comments = row.querySelectorAll('.center')[2];
  var a = document.createElement('a');
  a.textContent = comments.textContent;
  a.href = link.href + '#comments';
  a.style.color = 'black';
  comments.textContent = '';
  comments.appendChild(a);
}
