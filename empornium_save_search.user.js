// ==UserScript==
// @name         empornium saved searches
// @namespace    https://www.empornium.me/
// @description  Saves searches in browser storage
// @author       ephraim
// @include      https://www.empornium.tld/torrents.php*
// @version      1
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


var DBName = 'empSavedSearches';
var searchDB = [];
var searchBox = document.getElementById('search_box');
if (!searchBox) return; // not on search page
var tagList = document.getElementById('taglist');
var viewSearchesButton = document.createElement('a');
viewSearchesButton.text = '(View saved searches)';
viewSearchesButton.href = '#';
viewSearchesButton.addEventListener('click', toggleViewSavedSearches);
var wrapper = document.createElement('span');
wrapper.style.cssText = 'float:right;padding-right:5px';
wrapper.appendChild(viewSearchesButton);
tagList.parentElement.insertBefore(wrapper, tagList);

var searchButtons = document.querySelector('.search_buttons > span');
var saveButton = document.createElement('input');
saveButton.type = 'button';
saveButton.value = 'Save search 💾';
saveButton.addEventListener('click', saveButtonListener);
var brs = searchButtons.querySelectorAll('br');
searchButtons.insertBefore(saveButton, brs[brs.length - 1]);
createSearchList();


function toggleViewSavedSearches(e) {
    e.preventDefault();
    var classList = document.getElementById('savedSearches').classList;
    if (classList.contains('hidden')) {
        e.target.textContent = '(Hide saved searches)';
    } else {
        e.target.textContent = '(View saved searches)';
    }
    classList.toggle('hidden');
}


function saveSearch() {
    var search = {
        title: '',
        date: new Date().toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' }),
        textInputs: [
            {
                name: 'searchtext',
                desc: 'Search terms'
            },
            {
                name: 'title',
                desc: 'Title'
            },
            {
                name: 'sizeall',
                desc: 'Size'
            },
            {
                name: 'sizerange',
                desc: 'Size range'
            },
            {
                name: 'filelist',
                desc: 'File list'
            },
            {
                name: 'taglist',
                desc: 'Tag list'
            }
        ],
        checkBoxes: [
            {
                name: 'filter_freeleech'
            },
            {
                name: 'limit_matches'
            },
        ]
    };
    search.textInputs.forEach(input => {
        var field = searchBox.querySelector(`[name=${input.name}`);
        input.value = field.value;
    });
    search.checkBoxes.forEach(box => {
        var field = searchBox.querySelector(`[name=${box.name}`);
        box.checked = field.checked;
    });
    search.title = search.textInputs[0].value || search.textInputs[5].value;
    searchDB.push(search);
    GM_setValue(DBName, JSON.stringify(searchDB));
    rebuildSearchList();
}

function saveButtonListener(e) {
    e.preventDefault();
    saveSearch();
}


function restoreSearch(searchElement) {
    var savedSearch = searchDB[parseInt(searchElement.parentElement.dataset.index)];
    savedSearch.textInputs.forEach(input => {
        var field = searchBox.querySelector(`[name=${input.name}`);
        field.value = input.value;
    });
    savedSearch.checkBoxes.forEach(box => {
        var field = searchBox.querySelector(`[name=${box.name}`);
        field.checked = box.checked;
    });
}


function restoreSaveListener(e) {
    e.preventDefault();
    restoreSearch(e.target);
}


function deleteSearch(searchElement) {
    var index = parseInt(searchElement.parentElement.dataset.index);
    searchDB.splice(index, 1);
    GM_setValue(DBName, JSON.stringify(searchDB));
    rebuildSearchList();
}


function deleteListener(e) {
    e.preventDefault();
    deleteSearch(e.target);
}


function createSearchList() {
    var searchList = document.createElement('ul');
    searchList.id = 'searchList';
    searchDB = JSON.parse(GM_getValue(DBName, '[]'));

    var index = 0;
    for (var search of searchDB) {
        var searchName = document.createElement('a');
        searchName.textContent = search.title;
        searchName.title = getDescription(search);
        searchName.href = '#';
        searchName.addEventListener('click', restoreSaveListener);
        searchName.className = 'searchName';

        var deleteButton = document.createElement('span');
        deleteButton.className = 'deleteButton';
        deleteButton.textContent = '❌';
        deleteButton.title = 'Delete this search';
        deleteButton.addEventListener('click', deleteListener);

        var item = document.createElement('li');
        item.className = 'searchItem';
        item.dataset.index = index;
        item.appendChild(searchName);
        item.appendChild(deleteButton);
        searchList.appendChild(item);
        index++;
    }
    var searches = document.createElement('div');
    searches.id = 'savedSearches';
    searches.classList.add('hidden');
    searches.appendChild(searchList);
    tagList.parentElement.insertBefore(searches, tagList);

    return searches;
}


function rebuildSearchList() {
    var savedSearches = document.getElementById('savedSearches');
    var searchesClassList = savedSearches.classList;
    savedSearches.remove();
    createSearchList().classList = searchesClassList;
}


function getDescription(search) {
    var desc = '';
    for (var field of search.textInputs.filter(field => field.value)) {
        if (field.name === 'sizerange' && field.value === '0.01') continue;
        desc = desc + `Saved ${field.desc}: ${field.value}\n`;
    }
    desc = desc + `Date saved: ${search.date}`;
    return desc;
}

var style = document.createElement('style');
style.innerHTML = `
#searchList {
    list-style: none;
    column-count: 5;
    clear: both;
}

.searchName {
    overflow: hidden;
    text-overflow: ellipsis;
    display: inline-block;
    white-space: nowrap;
    max-width: calc(100% - 20px);
    width: 100%;
    vertical-align: middle;
}

.deleteButton {
    opacity: 0;
    vertical-align: middle;
    color: #e40303;
    filter: drop-shadow(1px 2px 1px #6f6a6a);
}

.deleteButton:hover {
    filter: unset;
    cursor:pointer;
}

.deleteButton:active {
    border-width: 1px;
    border-style: inset;
    border-color: #929292;
    border-radius: 3px;
}

.searchItem:hover .deleteButton {
    opacity: 1;
}

.searchItem {
    margin: 5px 0 5px 0;
    background-color: #EFF3F6;
    border-radius: 5px;
    padding: 3px;
}
`;
document.head.appendChild(style);