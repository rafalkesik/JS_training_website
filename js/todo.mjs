// export { todoModule }
// import { menuBarChangeVisibility } from "./template.mjs";
export { start, prepToDoApp, defineArray, printStartingList, listTasks, submitForm, addTask, clearTasks, toggleTaskStatus }

// let todoModule = ( (window, document) => {


    // Defines global variables for ToDoApp
    let form, input, input_li, list, clearForm, parsedArrayOfTasks, parsedArrayOfStatuses;

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

        defineArray();
        printStartingList();
    }

    // Defines initial value of variable parsedArrayOfTasks
    function defineArray() {
        console.log(`Fetching tasks from local storage: ${window.localStorage.getItem("tasks")}...`);
        if (!!window.localStorage.getItem("tasks")) {
            parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
            parsedArrayOfStatuses = JSON.parse(window.localStorage.getItem("statuses"));
            console.log(window.localStorage.getItem("statuses"));
            if (!window.localStorage.getItem("statuses")) {
                parsedArrayOfStatuses = [];
                parsedArrayOfTasks.forEach(() => {parsedArrayOfStatuses.push(0)});
            }
        } else {
            parsedArrayOfTasks = [];
            parsedArrayOfStatuses = [];
            // teraz powinienem dodać wszystko o parsedArrayOfStatuses, by utrzymywało te status w local storage i go wydobywało.
        }
        console.log("...DONE");
    }

    // Shows on page the list of tasks from local storage
    function printStartingList() {
        if (!!window.localStorage.getItem("tasks")) {
            // parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks")); //This was here but it seems to be unnecessary.

            console.log("Listing the tasks...");
            listTasks(parsedArrayOfTasks);
            console.log("...DONE");
        } else {
            console.log("No tasks in local storage.");
        }
    }

    // Takes an array and adds list items for each element
    function listTasks(arrayOfTasks) {
        // let list = document.getElementById("tasksList");  // this was declared 2nd time. thus i commented it out.
        arrayOfTasks.forEach((task, index) => {
            let taskElement = forgeTaskElement(task, index);
            list.insertBefore(taskElement, input_li);
        });
    }

    // Returns a task element with checkbox (<li> with inputed data).
    function forgeTaskElement(task, index) {
        let taskElement = document.createElement("li");
        let checked = "";
        let style = "";

        if (parsedArrayOfStatuses && (parsedArrayOfStatuses[index] === 1)) {
            checked = " checked";
            style = ' style="text-decoration:line-through"';
        }
        taskElement.innerHTML = `<input type="checkbox" name="Check task as completed" id="task-${index}" onclick="todo.toggleTaskStatus(this)"${checked}> <label for="task-${index}"${style}>${task}</label>`;
        return taskElement;
    }

    // Submits the input text to local storage
    function submitForm(event) {
        console.log("Submitting new task...");
        // Prevents submit button from refreshing page
        event.preventDefault();
        // Adds new task to local storage and to parsedArrayOfTasks & -Statuses variables.
        let newTaskIndex =  (parsedArrayOfTasks.push(input.value)-1);
                            parsedArrayOfStatuses.push(0);
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
    }

    // Clears tasks from page & local storage & reloads the page
    function clearTasks(event) {
        console.log("Clearing all tasks");
        window.localStorage.setItem("tasks", '[]');
        window.localStorage.setItem("statuses", '[]');
        window.location.reload();
        console.log("DONE");
    }

    // Crosses out task text when checkbox checked & reverse & updates statuses variable.
    function toggleTaskStatus(input) {
        let labelText = findLabelOfInput(input);
        let index = labelText.getAttribute("for").match(/\d+/gm)[0];

        parsedArrayOfStatuses[index] = +(input.checked);
        window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));
        if (input.checked) {
            labelText.setAttribute('style', 'text-decoration:line-through');
        } else {
            labelText.removeAttribute('style');
        }
    }

    // Returns the label of the given input.
    function findLabelOfInput(input) {
        let labels = Array.from(document.getElementsByTagName("label"));
        return labels.filter(element => element.getAttribute("for") === input.id)[0];
    }

// })(window, document);