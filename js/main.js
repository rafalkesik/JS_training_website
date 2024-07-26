let form, input, input_li, list, clearForm, parsedArrayOfTasks;

document.addEventListener("DOMContentLoaded", function(event) {
    console.log("DOM loaded.")
    console.log(document.title);
    if (document.title === "To-do-App | JS Training Site") {
        form = document.getElementById("addTaskForm")
        input = document.getElementById("addTask");
        console.log(input);
        input_li = form.parentNode;
        list = document.getElementById("tasksList");
        clearForm = document.getElementById("clearTasksForm");
        form.addEventListener('submit', submitForm);
        clearForm.addEventListener('submit', clearTasks);
        console.log("Event Listenery załozone na guziki")  // TO BE DELETED
        defineArray();
        printStartingList();
    }
});

// Defines variable parsedArrayOfTasks
function defineArray() {
    console.log(`Tasklist from local storage: ${window.localStorage.getItem("tasks")}`);
    if (JSON.parse(window.localStorage.getItem("tasks")).length) {
        parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
    } else {
        parsedArrayOfTasks = [];
    }
}

// Shows on page the list of tasks from local storage
function printStartingList() {
    if (JSON.parse(window.localStorage.getItem("tasks")).length) {
        parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
        listTasks(parsedArrayOfTasks);
        console.log("somthing in local storage");
    } else {
        console.log("nothing in local storage");
    }
}

// Opens or closes the menu bar in mobile view.
function menuBarChangeVisibility() {
    let label = document.querySelector('[for="menu-bar-visible"]');
    let checkbox = document.querySelector("#menu-bar-visible");
    let iconClassList = label.classList;
    let dropDownMenu = document.querySelector("#drop-down-menu");
    // The below one to be deleted, and the above to be uncommented.
    // let dropDownMenu = document.querySelector("#header-nav-links");

    if (checkbox.checked) {
        // dropDownMenu.style.display = 'block';
        iconClassList.add("highlight_text");
    } else {
        // dropDownMenu.style.display = 'none';
        iconClassList.remove("highlight_text");
    }

    console.log("Ikona wciśnięta");
}


// Submits the input text to local storage
function submitForm(event) {
    // Prevents submit button from refreshing page
    event.preventDefault();
    // Adds new task to the page
    addTask();
    // Adds new task to local storage
    parsedArrayOfTasks.push(input.value);
    window.localStorage.setItem("tasks", JSON.stringify(parsedArrayOfTasks));
    // Clears the input box
    input.value = "";
}


// Takes an array and adds list items for each element
function listTasks(arrayOfTasks) {
    let list = document.getElementById("tasksList");
    arrayOfTasks.forEach(element => {
        let listItem = document.createElement("li");
        listItem.innerHTML = element;
        list.insertBefore(listItem, input_li);
    });
}

// Adds a task to the To-do App above input
function addTask() {
    let displayElement = document.getElementById("newTask");
    let listItem = document.createElement("li");
    listItem.innerHTML = input.value;
    list.insertBefore(listItem, input_li);
}

function clearTasks(event) {
    window.localStorage.setItem("tasks", '[]');
    window.location.reload();
}