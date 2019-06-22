// ==UserScript==
// @name        empornium show spoilers
// @namespace   empornium
// @description Opens spoilers with images in them
// @include     https://www.empornium.me/torrents.php?id=*
// @version     2
// @author      ephraim
// @grant       none
// ==/UserScript==

var maxImages = 5;
var spoilers = document.querySelectorAll('a[onclick="BBCode.spoiler(this);"]');
for (var spoiler of spoilers) {
  var isImg = spoiler.nextElementSibling.querySelectorAll('img');
  if (isImg.length < 1 || isImg.length >= maxImages) continue;
  BBCode.spoiler(spoiler);
}
