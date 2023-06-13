// ==UserScript==
// @name         empornium saved searches
// @namespace    https://www.empornium.me/
// @description  Saves searches in browser storage
// @author       ephraim
// @match        https://www.empornium.me/torrents.php*
// @match        https://www.empornium.sx/torrents.php*
// @match        https://www.empornium.is/torrents.php*
// @version      4.2
// @grant        GM_setValue
// @grant        GM_getValue
// ==/UserScript==


var DB_NAME = 'empSavedSearches';
var KEEP_OPEN_CHECKBOX_NAME = 'empSavedSearchesKeepOpen';
var searchDB = [];

var searchBox = document.getElementById('search_box');
if (!searchBox) return; // not on search page
var tagList = document.getElementById('taglist');

var saveCheckbox = document.createElement('input');
saveCheckbox.type = 'checkbox';
saveCheckbox.id = 'searchSaveCheckbox';
saveCheckbox.checked = GM_getValue(KEEP_OPEN_CHECKBOX_NAME, false);
saveCheckbox.addEventListener('click', checkboxListener);
var saveCheckboxLabel = document.createElement('label');
saveCheckboxLabel.id = 'searchSaveCheckboxLabel';
saveCheckboxLabel.innerText = 'Keep saved searches visible';
saveCheckboxLabel.appendChild(saveCheckbox);

var viewSearchesButton = document.createElement('a');
viewSearchesButton.text = saveCheckbox.checked ? '(Hide saved searches)' : '(View saved searches)';
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
saveButton.style.marginTop = '10px';
saveButton.style.display = 'block';
searchButtons.appendChild(saveButton);

var nameField = document.createElement('input');
nameField.type = 'text';
nameField.placeholder = 'Search name';
nameField.style.width = '7em';
nameField.style.display = 'block';
nameField.id = 'searchSaveName';
nameField.name = 'searchname';
searchButtons.appendChild(nameField);


var searchDrawer = document.createElement('div');
searchDrawer.id = 'searchSaveDrawer';
if (!saveCheckbox.checked) searchDrawer.className = 'hidden';
searchDrawer.appendChild(saveCheckboxLabel);
tagList.parentElement.insertBefore(searchDrawer, tagList);

createSearchList();


function checkboxListener(e) {
    GM_setValue(KEEP_OPEN_CHECKBOX_NAME, e.target.checked);
}


function toggleViewSavedSearches(e) {
    e.preventDefault();
    var classList = document.getElementById('searchSaveDrawer').classList;
    e.target.textContent = classList.contains('hidden') ? '(Hide saved searches)' : '(View saved searches)';
    classList.toggle('hidden');
}


function saveSearch() {
    var search = {
        title: '',
        date: new Date().toLocaleDateString('default', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long', hour: '2-digit', minute: '2-digit' }),
        textInputs: [
            {
                name: 'searchtext',
                desc: 'search terms'
            },
            {
                name: 'title',
                desc: 'title'
            },
            {
                name: 'sizeall',
                desc: 'size'
            },
            {
                name: 'sizerange',
                desc: 'size range'
            },
            {
                name: 'filelist',
                desc: 'file list'
            },
            {
                name: 'taglist',
                desc: 'tag list'
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
    search.title = searchBox.querySelector(`#searchSaveName`).value || search.textInputs[0].value || search.textInputs[1].value || search.textInputs[5].value || 'Unknown search';
    searchDB.push(search);
    searchDB.sort((a,b) => a.title.localeCompare(b.title)); // sort by name
    GM_setValue(DB_NAME, JSON.stringify(searchDB));
    rebuildSearchList();
}

function saveButtonListener(e) {
    e.preventDefault();
    saveSearch();
}


function restoreSearch(searchElement) {
    var savedSearch = searchDB[parseInt(searchElement.closest('.searchItem').dataset.index)];
    savedSearch.textInputs.forEach(input => {
        var field = searchBox.querySelector(`[name=${input.name}`);
        field.value = input.value;
    });
    savedSearch.checkBoxes.forEach(box => {
        var field = searchBox.querySelector(`[name=${box.name}`);
        field.checked = box.checked;
    });
    document.getElementById('search_form').submit();
}


function restoreListener(e) {
    e.preventDefault();
    restoreSearch(e.target);
}

function appendSearch(searchElement) {
    var savedSearch = searchDB[parseInt(searchElement.closest('.searchItem').dataset.index)];
    savedSearch.textInputs.forEach(input => {
        var field = searchBox.querySelector(`[name=${input.name}`);
        if (field.name === 'sizerange') return;
        if (!input.value.length) return
        field.value = field.value + ' ' + input.value;
    });
    savedSearch.checkBoxes.forEach(box => {
        var field = searchBox.querySelector(`[name=${box.name}`);
        field.checked = box.checked;
    });
}

function appendListener(e) {
    e.preventDefault();
    appendSearch(e.target);
}


function deleteSearch(searchElement) {
    var searchItem = searchElement.closest('.searchItem');
    var index = parseInt(searchItem.dataset.index);
    searchDB.splice(index, 1);
    GM_setValue(DB_NAME, JSON.stringify(searchDB));
    searchItem.classList.add('searchDeleted')
    setTimeout(rebuildSearchList, 500)
    //rebuildSearchList();
}


function deleteListener(e) {
    e.preventDefault();
    deleteSearch(e.target);
}


function createSearchList() {
    var searchList = document.createElement('ul');
    searchList.id = 'searchList';
    searchDB = JSON.parse(GM_getValue(DB_NAME, '[]'));

    var index = 0;
    for (var search of searchDB) {
        var searchName = document.createElement('a');
        searchName.textContent = search.title;
        searchName.title = getDescription(search);
        searchName.href = '#';
        searchName.addEventListener('click', restoreListener);
        searchName.className = 'searchName';

        var appendButton = document.createElement('span');
        appendButton.className = 'saveButton appendButton';
        appendButton.textContent = '➕';
        appendButton.title = 'Append this search';
        appendButton.addEventListener('click', appendListener);

        var deleteButton = document.createElement('span');
        deleteButton.className = 'saveButton deleteButton';
        deleteButton.textContent = '❌';
        deleteButton.title = 'Delete this search';
        deleteButton.addEventListener('click', deleteListener);

        var buttons = document.createElement('span');
        buttons.className = 'searchButtons';
        buttons.appendChild(appendButton);
        buttons.appendChild(deleteButton);

        var item = document.createElement('li');
        item.className = 'searchItem';
        item.dataset.index = index;
        item.appendChild(searchName);
        item.appendChild(buttons);
        searchList.appendChild(item);
        index++;
    }
    searchDrawer.appendChild(searchList);
}


function rebuildSearchList() {
    var searchList = document.getElementById('searchList');
    searchList.remove();
    createSearchList();
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
    column-count: 5;
    column-rule: dotted thin #d8d8d8;
    column-gap: 2em;
}

.searchName {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex-grow: 2;
    padding: 1px;
}

.saveButton {
    opacity: 0;
    vertical-align: middle;
    filter: drop-shadow(1px 2px 1px #6f6a6a);
    border-color: #0000;
    border-width: 1px;
    border-style: inset;
    border-radius: 3px;
}

.saveButton:hover {
    filter: unset;
    cursor:pointer;
}

.saveButton:active {
    border-color: #929292;
}

.searchItem:hover .saveButton {
    opacity: 1;
}

.searchButtons {
  display: flex;
  gap: 3px;
}

.deleteButton {
    color: #000000ab;
    text-shadow: 0 0 0 #d91f1f;
}

.appendButton {
    color: #0006;
    text-shadow: 0 0 0 #2e9d06;
}

.searchItem {
    margin: 3px 0 3px 0;
    background-image: linear-gradient(to bottom right, #eff3f6, #d4dfea);
    border-radius: 6px;
    padding: 2px 3px;
    display: flex;
}

#searchSaveCheckboxLabel {
    margin: 10px 0 10px 0;
}

#searchSaveCheckbox {
    margin-left: 5px;
}

.searchDeleted {
    animation: delete-animation 0.5s cubic-bezier(0.55, -0.04, 0.91, 0.94) forwards;
    /*transform origin is moved to the bottom left corner*/
    transform-origin: 0% 100%;
}

@keyframes delete-animation {
    0% {
        opacity: 1;
        transform: rotateZ(0);
}

    100% {
        opacity: 0;
        transform: translateY(60px) rotateZ(20deg);
    }
}
`;
document.head.appendChild(style);