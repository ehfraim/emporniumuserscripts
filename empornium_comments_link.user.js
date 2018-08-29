// ==UserScript==
// @name        empornium link to comments
// @namespace   none
// @description Make comment number in torrent table a link to the comment section
// @include     https://www.empornium.tld/torrents.php*
// @exclude     https://www.empornium.tld/torrents.php?action=notify
// @version     3
// @grant       none
// ==/UserScript==

var torrentRows = document.querySelectorAll('.torrent');
for (var row of torrentRows) {
  var comments = row.querySelectorAll('.center')[2];
  var ul = comments.querySelector('ul');
  var a;
  if (ul) {
    var links = row.querySelectorAll('a[href*="/torrents.php?id="]');
    for (var td = 0; td < ul.childNodes.length; td++) {
      a = document.createElement('a');
      a.href = links[td+1].href + '#comments';
      a.textContent = ul.childNodes[td].textContent;
      a.style.color = 'black';
      ul.childNodes[td].textContent = '';
      ul.childNodes[td].appendChild(a);
    }
  } else {
    var link = row.querySelector('a[href^="/torrents.php?id="]');
    a = document.createElement('a');
    a.textContent = comments.textContent;
    a.href = link.href + '#comments';
    a.style.color = 'black';
    comments.textContent = '';
    comments.appendChild(a);
  }
}
