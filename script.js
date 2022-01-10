const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item lists
const listColumns = document.querySelectorAll('.drag-item-list');
const newTaskListEl = document.getElementById('newTask-list');
const progressListEl = document.getElementById('progress-list');
const completeListEl = document.getElementById('complete-list');
const onHoldListEl = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false;

// Initialize arrays
let newTaskListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag functionality initialise global vars
let draggedItem;
let dragging = false;
let currentColumn;

// Get arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('newTaskItems')) {
    newTaskListArray = JSON.parse(localStorage.newTaskItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    newTaskListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage arrays
function updateSavedColumns() {
  listArrays = [newTaskListArray, progressListArray, completeListArray, onHoldListArray];
  const arrayNames = ['newTask', 'progress', 'complete', 'onHold'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

// Filter arrays to remove empty Items
function filterArray(array) {
  const filteredArray = array.filter(item => item !== null);
  return filteredArray;
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item;
  listEl.draggable = true; // Allows item to grab and drag instead of default ie highlight text
  listEl.setAttribute('ondragstart', 'drag(event)');
  listEl.contentEditable = true;
  listEl.id = index;
  listEl.setAttribute('onfocusout', `updateItem(${index}, ${column})`);
  // Append
  columnEl.appendChild(listEl);
}

// Update columns in DOM - reset HTML, filter array, update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnLoad) {
    getSavedColumns();
  }
  // newTask column
  newTaskListEl.textContent = '';
  newTaskListArray.forEach((newTaskItem, index) => {
    createItemEl(newTaskListEl, 0, newTaskItem, index);
  });
  newTaskListArray = filterArray(newTaskListArray);

  // Progress column
  progressListEl.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressListEl, 1, progressItem, index);
  });
  progressListArray = filterArray(progressListArray);

  // Complete column
  completeListEl.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeListEl, 2, completeItem, index);
  });
  completeListArray = filterArray(completeListArray);

  // On Hold column
  onHoldListEl.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldListEl, 3, onHoldItem, index);
  });
  onHoldListArray = filterArray(onHoldListArray);

  // Run getSavedColumns only once, update local storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Updated item - Delete or update value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumnEl = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}

// Add new task to to column list and reset text box
function addToColumn(column) {
  const itemtext = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemtext);
  addItems[column].textContent = '';
  updateDOM();
}

// Show Add Item input box
function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden';
  saveItemBtns[column].style.display = 'flex';
  addItemContainers[column].style.display= 'flex';
}

// Hide Item input box
function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible';
  saveItemBtns[column].style.display = 'none';
  addItemContainers[column].style.display= 'none';
  addToColumn(column);
}

// Allow arrays to reflect dragged and dropped items
function rebuildArrays() {
  // newTaskListArray = [];
  // for (let i = 0; i < newTaskList.children.length; i++) {
  //   newTaskListArray.push(newTaskList.children[i].textContent);
  // }
  // progressListArray = [];
  // for (let i = 0; i < progressList.children.length; i++) {
  //   progressListArray.push(progressList.children[i].textContent);
  // }
  // completeListArray = [];
  // for (let i = 0; i < completeList.children.length; i++) {
  //   completeListArray.push(completeList.children[i].textContent);
  // }
  // onHoldListArray = [];
  // for (let i = 0; i < onHoldList.children.length; i++) {
  //   onHoldListArray.push(onHoldList.children[i].textContent);
  // }
  // Using Map function instead of For Loops above
  // Use Array.from to convert the HTMLcollection into an array for map to work with
  newTaskListArray = Array.from(newTaskListEl.children).map(i => i.textContent);
  progressListArray = Array.from(progressListEl.children).map(i => i.textContent);
  completeListArray = Array.from(completeListEl.children).map(i => i.textContent);
  onHoldListArray = Array.from(onHoldListEl.children).map(i => i.textContent);
  updateDOM();
}

// When item starts dragging
function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

// Column allows for item to drop
function allowDrop(e) {
  e.preventDefault();
}

// When item enters new column area
function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

// Dropping items into new column
function drop(e) {
  e.preventDefault();
  // On Drop, remove column background colour and padding added from above
  listColumns.forEach((column) => {
    column.classList.remove('over');
  });
  // Add item into new column
  const parent = listColumns[currentColumn];
  parent.appendChild(draggedItem);
  // Dragging complete
  dragging = false;
  rebuildArrays();
}

// On Load
updateDOM();
