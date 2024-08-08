// export { todoModule }
// import { menuBarChangeVisibility } from "./template.mjs";
export { start, prepToDoApp, defineArray, printStartingList, listTasks, submitForm, addTask, clearTasks, toggleTaskStatus, deleteTask, click, taskMove, click2, editName, markCompletion, showMobileOptions, hideMobileOptions, setDataChosen }


// Defines global variables for ToDoApp
let form, input, input_li, list, clearForm, parsedArrayOfTasks, parsedArrayOfStatuses, test, parsedArrayOfTags, parsedArrayOfPriorities;

// Waits for DOM to load to perform &
// & if page is to-do-app, executes 'prepare' function.
function start() {
    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM loaded.")
        if (document.title === "To-do-App | JS Training Site") {
            prepToDoApp();
        }
    });
}

// Prepares toDoApp - sets needed values to variables & loads previous tasks from Local Storage.
function prepToDoApp() {
    form = document.getElementById("addTaskForm")
    input = document.getElementById("addTask");
    input_li = form.parentNode;
    list = document.getElementById("tasksList");  // check if it's necessary. it is declared later as well. Delete this or there.
    clearForm = document.getElementById("clearTasksForm");
    
    console.log("Adding event listeners on buttons...")
    form.addEventListener('submit', submitForm);
    clearForm.addEventListener('submit', clearTasks);
    console.log("...DONE");

    test = document.getElementById("Test");
    test.addEventListener('click', click);
    let testSelect = document.getElementById("test-select");
    testSelect.addEventListener('change', click);

    defineArray();
    printStartingList();
}

// Defines initial value of variable parsedArrayOfTasks
function defineArray() {
    console.log(`Fetching tasks from local storage: ${window.localStorage.getItem("tasks")}...`);
    if (!!window.localStorage.getItem("tasks")) {
        parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
        parsedArrayOfStatuses = JSON.parse(window.localStorage.getItem("statuses"));
        parsedArrayOfTags = JSON.parse(window.localStorage.getItem("tags"));
        parsedArrayOfPriorities = JSON.parse(window.localStorage.getItem("priorities"));
        if (!window.localStorage.getItem("statuses")) {
            parsedArrayOfStatuses = [];
            parsedArrayOfTasks.forEach(() => {parsedArrayOfStatuses.push("0")});
        }
        if (!window.localStorage.getItem("tags")) {
            parsedArrayOfTags = [];
            parsedArrayOfTasks.forEach(() => {parsedArrayOfTags.push("0")});
        }
        if (!window.localStorage.getItem("priorities")) {
            parsedArrayOfPriorities = [];
            parsedArrayOfTasks.forEach(() => {parsedArrayOfPriorities.push("default")});
        }
    } else {
        parsedArrayOfTasks = [];
        parsedArrayOfStatuses = [];
        parsedArrayOfTags = [];
        parsedArrayOfPriorities = [];
    }
    console.log("...DONE");
}

// Shows on page the list of tasks from local storage
function printStartingList() {
    if (!!window.localStorage.getItem("tasks")) {
        console.log("Listing the tasks...");
        listTasks(parsedArrayOfTasks);
        console.log("...DONE");
    } else {
        console.log("No tasks in local storage.");
    }
}

// Takes an array and adds list items for each element
function listTasks(arrayOfTasks) {
    arrayOfTasks.forEach((task, index) => {
        let taskElement = forgeTaskElement(task, index);
        list.insertBefore(taskElement, input_li);
        let newTaskElement = document.getElementById(`task-${index}`).parentElement
        saveTagAndPrioChanges(newTaskElement);    
        colorPrioBox(index);
    });
}

function colorPrioBox(index) {
    let prioBox = document.getElementById(`prio-box-${index}`);
    let prioChooseBox = document.getElementById(`priority-${index}`);
    prioBox.setAttribute("data-chosen", prioChooseBox.value);
    // DONE ustal data-chosen jako value parsedarrayofpriorities[index]
    // dodaj onchange w forgepriorityelement, by tz zmienial priobox
    // dodaj klasę w main.css, by divy z data-chosen jako value miało kolorki
}

// Returns a whole task element.
function forgeTaskElement(task, index) {
    let taskElement = document.createElement("li");
    taskElement.setAttribute("class", "taskItem");
    
    let checked = "";
    let style = '';
    
    // It adds line-through style, if the task is checked
    if (parsedArrayOfStatuses && (parsedArrayOfStatuses[index] === 1)) {
        checked = " checked";
        style += 'text-decoration:line-through';
    }
    
    let onMouseOverTags = ` onmouseover="todo.showMobileOptions(${index})" onmouseout="todo.hideMobileOptions(${index})"`;


    // Adds style showing options on hover, for Mobiles.
    let onClickTag = ` onmousedown="todo.editName(event, ${index})"`;
    if (window.innerWidth < 600) {
        onClickTag = '';
    };
    
    // Makes individual elements of Task Element.
    let taskCheckbox = `<input class="checkbox" type="checkbox" name="Check task as completed" id="checkbox-${index}" onclick="todo.toggleTaskStatus(this)" ${checked}>`;
    let prioBox = `<div class='prio-box' id='prio-box-${index}'> </div>`
    let taskName = `<div class="clickable task-name" id="task-${index}" style="${style}">${task}</div>`;
    let taskNameEdit = `<form class="task-name-edit" style="display: none"> <input type="text" value="${parsedArrayOfTasks[index]}" id="task-name-edit-${index}"> </form>`;
    let mobileNameEdit = `<span class="mobile-name-edit" onmousedown="todo.editName(event, ${index})"> <input type="button" value="Edit" id="edit-button-${index}" style="display: none"> </span>`;
    let taskAssignTag = ForgeTagsElement(index);
    let taskAssignPriority = forgePriorityElement(index);
    let taskMoveUp = `<i class="fa-solid fa-circle-up clickable" onmousedown="todo.taskMove(${index}, 1)"></i>`
    let taskMoveDown = `<i class="fa-solid fa-circle-down clickable" onmousedown="todo.taskMove(${index}, 0)"></i>`
    let taskMove = `<span class="arrows-element"> ${taskMoveUp} ${taskMoveDown} </span>`;
    let taskDelete = `<span class="delete-element" onmousedown="todo.deleteTask(${index})"> <input type="button" value="Delete" id="delete-${index}" style="display: none"> </span>`
    
    // Combine elements into whole task line element.
    taskElement.innerHTML = `
        ${taskCheckbox} 
        <div class="task-details" id="task-details-${index}" ${onMouseOverTags}>
            <div class="task-details-up" id="task-details-up-${index}" ${onMouseOverTags}>
                ${prioBox} ${taskName} ${taskNameEdit}
            </div>
            <div class="task-details-bottom" id="task-details-bottom-${index}" ${onMouseOverTags}>
                ${taskAssignTag} ${taskAssignPriority} ${mobileNameEdit} ${taskDelete}
            </div>
        </div>`;

    return taskElement;
}

// Submits the input text to local storage & parsedArrayOfTasks & -Statuses variable
function submitForm(event) {
    console.log("Submitting new task...");
    // Prevents submit button from refreshing page
    event.preventDefault();
    // Adds new task to local storage and to parsedArrayOfTasks & -Statuses variables.
    let newTaskIndex =  (parsedArrayOfTasks.push(input.value)-1);
                        parsedArrayOfStatuses.push(0);
                        parsedArrayOfTags.push(0);
                        parsedArrayOfPriorities.push("default");

    window.localStorage.setItem("tasks", JSON.stringify(parsedArrayOfTasks));
    window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));
    // Adds new task to the page
    addTask(input.value, newTaskIndex);
    // Clears the input box
    input.value = "";
    console.log("...DONE");
}


// Adds a task to the To-do App above input
function addTask(task, index) {
    let taskElement = forgeTaskElement(task, index);

    list.insertBefore(taskElement, input_li);
    let newTaskElement = document.getElementById(`task-${index}`).parentElement
    saveTagAndPrioChanges(newTaskElement);  
}

// Clears tasks from page & local storage & reloads the page
function clearTasks(event) {
    event.preventDefault();
    if (!confirm("Are you sure?")) {
        console.log("Aborted clearing the tasks");
        return;
    }

    console.log("Clearing all tasks");
    clearTasksOnScreen();
    clearTasksStored();
    console.log("DONE");
}

function clearTasksOnScreen() {
    let taskList = (document.getElementsByClassName("taskItem"));
    let taskListArray = Array.from(taskList);

    taskListArray.forEach(element => {
        taskList[0].remove();
    });
}

function clearTasksStored() {
    parsedArrayOfTasks = [];
    parsedArrayOfStatuses = [];
    parsedArrayOfTags = [];
    parsedArrayOfPriorities = [];
    uploadToLocalStorage();
}

function deleteTask(index) {
        clearTasksOnScreen();
    // remove the task from variables & local storage
        parsedArrayOfTasks.splice(index, 1);
        parsedArrayOfStatuses.splice(index, 1);
        parsedArrayOfTags.splice(index, 1);
        parsedArrayOfPriorities.splice(index, 1);
        uploadToLocalStorage();
    // call listitems func
        listTasks(parsedArrayOfTasks);
}

// Crosses out task text when checkbox checked & reverse & updates statuses variable.
function toggleTaskStatus(input) {
    let index = input.id.match(/\d+/gm)[0];
    let taskNameElement = document.getElementById(`task-${index}`);
    
    parsedArrayOfStatuses[index] = +(input.checked);
    window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));

    console.log(input.checked);
    if (input.checked) {
        taskNameElement.style.setProperty('text-decoration', 'line-through')
    } else {
        taskNameElement.style.removeProperty('text-decoration');
    }
}

// Returns the Task Name Element of the given input.
function findNameElement(input) {
    let spans = Array.from(input.parentElement.children);
    return spans.filter(element => element.tagName === "SPAN")[0];
}

function ForgeTagsElement(id) {
    let tags = ["Tag", "Work", "Sport", "Other"];
    let tagsElements = "";
    let value = null
    
    if (JSON.parse(window.localStorage.getItem("tags"))) {
        value = JSON.parse(window.localStorage.getItem("tags"))[id];
    }
    tags.forEach ((element, index) => {
        let selected = "";
        if (`${index}` === value) {
            selected = " selected='selected'";
        }

        tagsElements += `<option value="${index}"${selected}>${element}</option>`;
    });

    let select = `<div class="tag-element"> <select id="tag-${id}"> ${tagsElements} </select> </div>`;

    return select;
}

function forgePriorityElement(id) {
    let tags = ["High", "Mid", "Low"];
    let prioElements = "<option value='default'>Priority</option>";
    let value = "default";

    if (JSON.parse(window.localStorage.getItem("priorities"))) {
        value = JSON.parse(window.localStorage.getItem("priorities"))[id];
    }

    tags.forEach ((element, index) => {
        let selected = "";
        if (`${index}` === value) {
            selected = " selected";
        }

        prioElements += `<option value="${index}"${selected}>${element}</option>`
    });

    let select = `<div class="priority-element"> <select id="priority-${id}" data-chosen="${value}" onchange='todo.setDataChosen(${id})' style="display: none"> ${prioElements} </select> </div>`;

    return select;
}

function saveTagAndPrioChanges(taskElement) {
    let id = Array.from(taskElement.children)[0].getAttribute("id");
    let index = id.match(/\d+/gm)[0];
    let tagElement = document.getElementById(`tag-${index}`);
    let prioElement = document.getElementById(`priority-${index}`);

    tagElement.addEventListener('change', function() {
        console.log("changed tag");
        parsedArrayOfTags[index] = tagElement.value;
        window.localStorage.setItem("tags", JSON.stringify(parsedArrayOfTags));
    });
}

// moves task up for 1 and down for 0
function taskMove(id, direction) {
    if ((direction !== 0) && (direction !== 1)) {
        throw(console.error(`TaskMove(id, direction) function error. Passed direction value (${direction}) is invalid. Direction should be 1 for move-up and 0 for move-down.`));
    }
    if ((id === 0 && direction === 1) || (id === (parsedArrayOfTasks.length-1) && direction === 0)) {
        console.log("You can't move it anymore in this direction.");
        return
    }

    if (direction === 1) {
        console.log("moving up");
        parsedArrayOfTasks = changePlaces(parsedArrayOfTasks, id, id-1);
        parsedArrayOfStatuses = changePlaces(parsedArrayOfStatuses, id, id-1);
        parsedArrayOfTags = changePlaces(parsedArrayOfTags, id, id-1);
        uploadToLocalStorage();

        clearTasksOnScreen();
        listTasks(parsedArrayOfTasks)
    }
    if (direction === 0) {
        console.log("moving down");
        parsedArrayOfTasks = changePlaces(parsedArrayOfTasks, id, id+1);
        parsedArrayOfStatuses = changePlaces(parsedArrayOfStatuses, id, id+1);
        parsedArrayOfTags = changePlaces(parsedArrayOfTags, id, id+1);
        uploadToLocalStorage();
        
        clearTasksOnScreen();
        listTasks(parsedArrayOfTasks)
    } 

}

function changePlaces(array, idx1, idx2) {
    let first = array[idx1];
    let second = array[idx2];
    array.splice(idx1, 1, second);
    array.splice(idx2, 1, first);
    return array;
}

function uploadToLocalStorage() {
    window.localStorage.setItem("tasks", JSON.stringify(parsedArrayOfTasks));
    window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));
    window.localStorage.setItem("tags", JSON.stringify(parsedArrayOfTags));
    window.localStorage.setItem("priorities", JSON.stringify(parsedArrayOfPriorities));
}

// This function edits the title of the task. 
// Keywords: edit task name; edit task title; edit task text;
function editName(event, index) {
    event.preventDefault();
    let name = document.getElementById(`task-${index}`);
    let nameInput = document.getElementById(`task-name-edit-${index}`);
    let checkbox = document.getElementById(`checkbox-${index}`);
    name.style.display = "none";
    nameInput.style.display = ""
    nameInput.parentElement.style.display = ""

    console.log(nameInput);
    nameInput.focus();

    nameInput.parentElement.addEventListener('focusout', function() {
        // let cross = "";
        if (checkbox.checked) {
            console.log("crossing out");
            // cross = " text-decoration:line-through;"
            name.style.setProperty("text-decoration", "line-through");
        }

        name.style.display = '';
        nameInput.parentElement.style.display = "none";

        return
    });

    nameInput.parentElement.addEventListener('submit', function(event) {
        event.preventDefault();
        name.textContent = nameInput.value;
        console.log(nameInput);
        parsedArrayOfTasks[index] = nameInput.value;
        uploadToLocalStorage();

        // let cross = "";
        if (checkbox.checked) {
            console.log("crossing out");
            // cross = " text-decoration:line-through"
            name.style.setProperty("text-decoration", "line-through");
        }

        name.style.display = '';
        nameInput.parentElement.style.display = "none";
    });
}

function markCompletion() {
    let tasks = Array.from(document.getElementsByClassName("taskItem"));
    tasks.forEach((task, index) => {
        if (parsedArrayOfStatuses[index] === 0) {
            task.classList.add("unfinished");
        } else {
            task.classList.add("finished");
        }
        
    });
}

function showMobileOptions (index) {
    // let clickedTask = Array.from(document.getElementsByClassName("taskItem"))[index];
    let taskDetailsElement = document.getElementById(`task-details-${index}`);
    // let taskActionsElement = document.getElementById(`task-details-bottom-${index}`);
    let prioDiv = document.getElementById(`priority-${index}`);
    let editSpan = document.getElementById(`edit-button-${index}`);
    let delSpan = document.getElementById(`delete-${index}`);
    let taskDetailsBottom = document.getElementById(`task-details-bottom-${index}`);

    // taskActionsElement.classList.add("task-details-bottom-show");
    // taskActionsElement.classList.remove("task-details-bottom");
    // taskActionsElement.style.display = "flex";
    // zamiast tego na gorze, pokazujemy priority, edit, delete buttons:
    prioDiv.style.display = "inline-block";
    editSpan.style.display = "inline-block";
    delSpan.style.display = "inline-block";
    taskDetailsBottom.classList.add("task-details-bottom-show");

    // clickedTask.style.flex = "1 1 0";

    // tested code:
        // delete onMouseOver from this task element.
    taskDetailsElement.onmouseover = "";
}

function hideMobileOptions (index) {
    // let clickedTask = Array.from(document.getElementsByClassName("taskItem"))[index];
    let taskDetailsElement = document.getElementById(`task-details-${index}`);
    let taskActionsElement = document.getElementById(`task-details-bottom-${index}`);
    let prioDiv = document.getElementById(`priority-${index}`);
    let editSpan = document.getElementById(`edit-button-${index}`);
    let delSpan = document.getElementById(`delete-${index}`);
    let taskDetailsBottom = document.getElementById(`task-details-bottom-${index}`);

    if (taskActionsElement) {
        // taskActionsElement.classList.remove("task-details-bottom-show");
        // taskActionsElement.classList.add("task-details-bottom");
        // taskActionsElement.style.display = "none";
        prioDiv.style.display = "none";
        editSpan.style.display = "none";
        delSpan.style.display = "none";
        taskDetailsBottom.classList.remove("task-details-bottom-show");

        // tested code:
            // add onMouseOver to this task element.
        taskDetailsElement.onmouseover = `todo.showMobileOptions(${index})`;
    }
}

// Sets data-chosen, which colors prio elements. Also, moves task to place determined by priority tag.
function setDataChosen(index) {
    
    // Set datasets, that are targeted in css to color priority boxes.
    let prioSetBox = document.getElementById(`priority-${index}`);
    let prioBox = document.getElementById(`prio-box-${index}`);
    
    prioSetBox.dataset.chosen = prioSetBox.value;
    prioBox.dataset.chosen = prioSetBox.value;
    
    console.log(`wybrano priority na indeksie ${index} na wartość ${prioSetBox.value}`)
    console.log("1: array:");
    console.log(parsedArrayOfPriorities);

    // Change prio tag in variables
    console.log(`2: Array:`)
    console.log(parsedArrayOfPriorities);

    parsedArrayOfPriorities[index] = prioSetBox.value;

    console.log("3: Array:")
    console.log(parsedArrayOfPriorities);

    

    // Move task to its new place based on the new priority tag. & Upload to localStorage and push it on screen.
    let goalIndex = determineIndex(index);
    parsedArrayOfTasks = moveTo(parsedArrayOfTasks, index, goalIndex);
    parsedArrayOfTags = moveTo(parsedArrayOfTags, index, goalIndex);
    parsedArrayOfStatuses = moveTo(parsedArrayOfStatuses, index, goalIndex);
    parsedArrayOfPriorities = moveTo(parsedArrayOfPriorities, index, goalIndex);
    uploadToLocalStorage();
    clearTasksOnScreen();
    listTasks(parsedArrayOfTasks);

    console.log("4: array:")
    console.log(parsedArrayOfPriorities);
}

// Moves a task in array to different place and returns the new array.
function moveTo (array, taskIndex, goalIndex) {
    let first = array[taskIndex];
    array.splice(taskIndex, 1);
    array.splice(goalIndex, 0, first);
    return array
}

// returns the index, to which the element should be transported based on the new priority tag (high -> mid -> low).
function determineIndex(index) {
    let highs = parsedArrayOfPriorities.filter( element => element === "0").length
    let mids = parsedArrayOfPriorities.filter( element => element === "1").length
    let lows = parsedArrayOfPriorities.filter( element => element === "2").length
    let defaults = parsedArrayOfPriorities.filter( element => element === "default").length
    let thisPrio = document.getElementById(`priority-${index}`).value;

    if (thisPrio === "0") {
        return highs - 1;
    }
    if (thisPrio === "1") {
        return (highs + mids - 1);
    }
    if (thisPrio === "2") {
        return (highs + mids + lows - 1);
    }
    if (thisPrio === "default") {
        return (highs + mids + lows + defaults - 1);
    }
}

function click(element) {
    // event.preventDefault();
    console.log("clicked on button");

    let name = document.getElementById("lol");
    let nameInput = name.nextElementSibling;

    name.setAttribute("style", "display: none");
    nameInput.setAttribute("style", "inline-block");
    
    nameInput.focus();
    nameInput.parentElement.addEventListener('submit', function(event) {
        event.preventDefault();
        name.textContent = nameInput.value;

        name.setAttribute("style", "display: inline-block");
        nameInput.setAttribute("style", "display: none");
            
    });
}

function click2(event) {
    // event.preventDefault();
    console.log(parsedArrayOfPriorities);
    // determineIndex("1");
    // console.log(moveTo(["a", "b", "c"], 0, 2));
    console.log(determineIndex(4));
}
