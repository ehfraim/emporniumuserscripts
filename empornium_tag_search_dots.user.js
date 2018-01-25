// ==UserScript==
// @name        empornium replace whitespace in tag inputs
// @namespace   none
// @description Replaces whitespace with dots when pasting into tag inputs
// @include     https://www.empornium.me/*
// @version     1
// @grant       none
// @run-at      document-idle
// ==/UserScript==

var taginput = document.getElementById('taginput');
var topTagInput = document.getElementById('searchbox_tags');
taginput.onpaste = replaceWhiteSpace;
topTagInput.onpaste = replaceWhiteSpace;

function replaceWhiteSpace(e) {
  var pasted = e.clipboardData.getData('text/plain').trim().replace(/\s/g, '.');
  var existingValue = e.target.value;
  var selStart = e.target.selectionStart;
  var selEnd = e.target.selectionEnd;
  var corrected = existingValue.substring(0,selStart) + pasted + existingValue.substring(selEnd);

  window.setTimeout( () => {
    e.target.value = corrected;
  }, 1); 
}
