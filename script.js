const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item lists
const listColumns = document.querySelectorAll('.drag-item-list');
const newTaskList = document.getElementById('newTask-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

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
  newTaskList.textContent = '';
  newTaskListArray.forEach((newTaskItem, index) => {
    createItemEl(newTaskList, 0, newTaskItem, index);
  });
  // Progress column
  progressList.textContent = '';
  progressListArray.forEach((progressItem, index) => {
    createItemEl(progressList, 1, progressItem, index);
  });
  // Complete column
  completeList.textContent = '';
  completeListArray.forEach((completeItem, index) => {
    createItemEl(completeList, 2, completeItem, index);
  });
  // On Hold column
  onHoldList.textContent = '';
  onHoldListArray.forEach((onHoldItem, index) => {
    createItemEl(onHoldList, 3, onHoldItem, index);
  });
  // Run getSavedColumns only once, update local storage
  updatedOnLoad = true;
  updateSavedColumns();
}

// Updated item - Delete or update value
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  console.log(selectedArray);
  const selectedColumnEl = listColumns[column].children;
  console.log(selectedColumnEl[id].textContent);
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
  newTaskListArray = [];
  for (let i = 0; i < newTaskList.children.length; i++) {
    newTaskListArray.push(newTaskList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

// When item starts dragging
function drag(e) {
  draggedItem = e.target;
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
  rebuildArrays();
}

// On Load
updateDOM();
