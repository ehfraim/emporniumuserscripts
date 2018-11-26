// ==UserScript==
// @name        empornium tag list columns
// @namespace   empornium
// @description Move tag list to middle and change layout to columns
// @include     https://www.empornium.me/torrents.php?id=*
// @version     3
// @grant       none
// ==/UserScript==

var minRowsPerColumn = 5;
var columns = 5;

var tags = document.getElementById('tag_container');
var style = document.createElement('style');
style.innerHTML = `
ul.tag_list {
  margin: 15px;
}

ul.tag_list>li:nth-child(odd) {
  background-color: #eff3f6
}

li.tag_item {
  margin: 1px 0px 3px 0px;
  overflow: hidden;
  max-width:180px;
}

li.tag_item > a {
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 130px;
}

a[title^="Vote up tag"] + span {
  display: none;
}

#torrent_tags_list {
  column-width: 180px;
  column-count: 5;
  display: inline-block;
}
`;
document.head.appendChild(style);

var middle = document.getElementsByClassName('middle_column')[0];
var cover = document.getElementById('coverimage');
var heads = document.querySelector('.sidebar').querySelectorAll('.head');
var tagHeader = cover === null ? heads[0] : heads[1];
middle.appendChild(tags);
middle.insertBefore(tagHeader, tags);

makeColumns();

// After adding a tag the whole list is downloaded again 
// so the class name needs to be readded.
var torrentTags = document.getElementById('torrent_tags');
var config = {childList: true, subtree:true};
var observer = new MutationObserver(mutations => {makeColumns();});
observer.observe(torrentTags, config);

function makeColumns() {
  var tagList = document.getElementById('torrent_tags_list');
  tagList.classList.add('tag_list');
  for (var tagLi of tagList.children) {
    tagLi.classList.add('tag_item');
  }
  var cols = Math.min(Math.round((tagList.children.length) / minRowsPerColumn), columns);
  tagList.style.columnCount = cols;
}
