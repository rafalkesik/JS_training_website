export { todoModule }
import { menuBarChangeVisibility } from "./template.mjs";

let todoModule = ( (window, document) => {


    // Defines global variables for ToDoApp
    let form, input, input_li, list, clearForm, parsedArrayOfTasks;

    // Waits for DOM to load to perform &
    // & if page is to-do-app, executes 'prepare' function.
    document.addEventListener("DOMContentLoaded", function(event) {
        console.log("DOM loaded.")
        if (document.title === "To-do-App | JS Training Site") {
            prepToDoApp();
        }

        let icon = document.getElementById("menu-bar-visible");
        console.log(icon);
        icon.addEventListener('click', menuBarChangeVisibility());
    });

    // Prepares toDoApp - sets needed values to variables & loads previous tasks from Local Storage.
    function prepToDoApp() {
        form = document.getElementById("addTaskForm")
        console.log(form);
        input = document.getElementById("addTask");
        input_li = form.parentNode;
        list = document.getElementById("tasksList");
        clearForm = document.getElementById("clearTasksForm");
        
        console.log("Adding event listeners on buttons...")
        form.addEventListener('submit', submitForm);
        clearForm.addEventListener('submit', clearTasks);
        console.log("DONE");

        defineArray();
        printStartingList();
    }

    // Defines initial value of variable parsedArrayOfTasks
    function defineArray() {
        console.log(`Fetching tasks from local storage: ${window.localStorage.getItem("tasks")}.`);
        if (!!window.localStorage.getItem("tasks")) {
            parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
        } else {
            parsedArrayOfTasks = [];
        }
        console.log("DONE");
    }

    // Shows on page the list of tasks from local storage
    function printStartingList() {
        if (!!window.localStorage.getItem("tasks")) {
            parsedArrayOfTasks = JSON.parse(window.localStorage.getItem("tasks"));
        
            console.log("Listing the tasks...");
            listTasks(parsedArrayOfTasks);
            console.log("DONE");
        } else {
            console.log("No tasks in local storage.");
        }
    }

    // Takes an array and adds list items for each element
    function listTasks(arrayOfTasks) {
        let list = document.getElementById("tasksList");
        arrayOfTasks.forEach(element => { //Maybe this should be turned into MAP function?
            let listItem = document.createElement("li");
            listItem.innerHTML = element;
            list.insertBefore(listItem, input_li);
        });
    }

    // Submits the input text to local storage
    function submitForm(event) {
        console.log("Submitting new task...");
        // Prevents submit button from refreshing page
        event.preventDefault();
        // Adds new task to the page
        addTask();
        // Adds new task to local storage
        parsedArrayOfTasks.push(input.value);
        window.localStorage.setItem("tasks", JSON.stringify(parsedArrayOfTasks));
        // Clears the input box
        input.value = "";
        console.log("DONE");
    }


    // Adds a task to the To-do App above input
    function addTask() {
        let displayElement = document.getElementById("newTask");
        let listItem = document.createElement("li");
        listItem.innerHTML = input.value;
        list.insertBefore(listItem, input_li);
    }

    // Clears tasks from page & local storage & reloads the page
    function clearTasks(event) {
        console.log("Clearing all tasks");
        window.localStorage.setItem("tasks", '[]');
        window.location.reload();
        console.log("DONE");
    }


})(window, document);