// export { todoModule }
// import { menuBarChangeVisibility } from "./template.mjs";
export { start, prepToDoApp, defineArray, printStartingList, listTasks, submitForm, addTask, clearTasks, toggleTaskStatus, deleteTask }

// let todoModule = ( (window, document) => {


    // Defines global variables for ToDoApp
    let form, input, input_li, list, clearForm, parsedArrayOfTasks, parsedArrayOfStatuses, test, parsedArrayOfTags;

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
            console.log(window.localStorage.getItem("statuses"));
            if (!window.localStorage.getItem("statuses")) {
                parsedArrayOfStatuses = [];
                parsedArrayOfTasks.forEach(() => {parsedArrayOfStatuses.push(0)});
            }
            console.log((!window.localStorage.getItem("tags")));
            console.log(`${parsedArrayOfTags}`);
            if (!window.localStorage.getItem("tags")) {
                parsedArrayOfTags = [];
                parsedArrayOfTasks.forEach(() => {parsedArrayOfTags.push("0")});
            }
        } else {
            parsedArrayOfTasks = [];
            parsedArrayOfStatuses = [];
            parsedArrayofTags = [];
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
            let newTaskElement = document.getElementById(`task-${index}`).parentElement
            saveTagChanges(newTaskElement);    
        });
    }

    // Returns a task element with checkbox (<li> with inputed data).
    function forgeTaskElement(task, index) {
        let taskElement = document.createElement("li");
        taskElement.setAttribute("class", "taskItem");
        let checked = "";
        let style = '';
        
        if (parsedArrayOfStatuses && (parsedArrayOfStatuses[index] === 1)) {
            checked = " checked";
            style += 'text-decoration:line-through';
        }
        let taskInput = `<input type="checkbox" name="Check task as completed" id="task-${index}" onclick="todo.toggleTaskStatus(this)"${checked}>`;
        let taskName = `<span id="task-${index}" style="${style}">${task}</span>`;
        let taskDelete = '<input type="button" value="Delete" onclick="todo.deleteTask(this)"">';
        let taskTag = ForgeTagsElement(index);

        // taskElement.innerHTML = `<input type="checkbox" name="Check task as completed" id="task-${index}" onclick="todo.toggleTaskStatus(this)"${checked}> <span id="task-${index}" style="${style}">${task}</span>`;
        taskElement.innerHTML = `${taskInput} ${taskName} ${taskTag} ${taskDelete}`;

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
        saveTagChanges(newTaskElement);  
    }

    // Clears tasks from page & local storage & reloads the page
    function clearTasks(event) {
        event.preventDefault();

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
        window.localStorage.setItem("tasks", '[]');
        window.localStorage.setItem("statuses", '[]');
        window.localStorage.setItem("tags", '[]');
        parsedArrayOfTasks = [];
        parsedArrayOfStatuses = [];
        parsedArrayOfTags = [];
    }

    function deleteTask(input) {
        let removedElement = input.parentElement;
        let id = Array.from(removedElement.children)[0].getAttribute("id");
        let removedIndex = id.match(/\d+/gm)[0];

        // change clear funtion to have 2 functions: clear tasks, & clear storage
            // done
        // call clear tasks func
            clearTasksOnScreen();
        // remove the task from variables & local storage
            parsedArrayOfTasks.splice(removedIndex, 1);
            parsedArrayOfStatuses.splice(removedIndex, 1);
            parsedArrayOfTags.splice(removedIndex, 1);
            window.localStorage.setItem("tasks", JSON.stringify(parsedArrayOfTasks));
            window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));
            window.localStorage.setItem("tags", JSON.stringify(parsedArrayOfTags));
        // call listitems func
            listTasks(parsedArrayOfTasks);
    }

    // Crosses out task text when checkbox checked & reverse & updates statuses variable.
    function toggleTaskStatus(input) {
        let taskNameElement = findNameElement(input);
        let index = taskNameElement.getAttribute("id").match(/\d+/gm)[0];

        parsedArrayOfStatuses[index] = +(input.checked);
        window.localStorage.setItem("statuses", JSON.stringify(parsedArrayOfStatuses));
        if (input.checked) {
            taskNameElement.setAttribute('style', 'text-decoration:line-through');
        } else {
            taskNameElement.setAttribute('style', '');
        }
    }

    // Returns the Task Name Element of the given input.
    function findNameElement(input) {
        let spans = Array.from(input.parentElement.children);
        return spans.filter(element => element.tagName === "SPAN")[0];
    }

    function ForgeTagsElement(id) {
        let tags = ["Programowanie", "Sport", "NIEZREALIZOWANE"];
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
        let select = `<span> <select id="tag-${id}"> ${tagsElements} </select> </span>`;

        return select;
    }

    function saveTagChanges(taskElement) {
        let id = Array.from(taskElement.children)[1].getAttribute("id");
        let index = id.match(/\d+/gm)[0];
        let tagElement = document.getElementById(`tag-${index}`)

        tagElement.addEventListener('change', function() {
            // parsedArrayOfTags = [0, 0, 0];
            parsedArrayOfTags[index] = tagElement.value;
            console.log(parsedArrayOfTags);
            window.localStorage.setItem("tags", JSON.stringify(parsedArrayOfTags));
        });
    }


    function click(event) {
        event.preventDefault();
        console.log("clicked on button");

        // let taskElement = Array.from(document.getElementById("tasksList").children)[2];
        // console.log(taskElement);
        // saveTagChanges(taskElement);
    }

// })(window, document);