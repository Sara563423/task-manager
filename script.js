document.addEventListener("DOMContentLoaded", loadTasks);

const taskInput = document.getElementById("task-input");
const addTaskButton = document.getElementById("add-task");
const taskList = document.getElementById("task-list");
const filterSelect = document.getElementById("filter");

addTaskButton.addEventListener("click", addTask);
filterSelect.addEventListener("change", filterTasks);

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.completed));
}

function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;

    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push({ text: taskText, completed: false });
    localStorage.setItem("tasks", JSON.stringify(tasks));
    
    createTaskElement(taskText, false);
    taskInput.value = "";
}

function createTaskElement(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;
    if (completed) li.classList.add("completed");

    const completeButton = document.createElement("button");
    completeButton.textContent = completed ? "Undo" : "Complete";
    completeButton.addEventListener("click", () => toggleComplete(text, li));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.addEventListener("click", () => deleteTask(text, li));

    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

function toggleComplete(text, li) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const task = tasks.find(t => t.text === text);
    task.completed = !task.completed;
    localStorage.setItem("tasks", JSON.stringify(tasks));

    li.classList.toggle("completed");
    li.querySelector("button:first-child").textContent = task.completed ? "Undo" : "Complete";
}

function deleteTask(text, li) {
    const tasks = JSON.parse(localStorage.getItem("tasks"));
    const updatedTasks = tasks.filter(t => t.text !== text);
    localStorage.setItem("tasks", JSON.stringify(updatedTasks));
    
    taskList.removeChild(li);
}

function filterTasks() {
    const filterValue = filterSelect.value;
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    taskList.innerHTML = "";

    tasks.forEach(task => {
        if (filterValue === "all" || 
            (filterValue === "completed" && task.completed) || 
            (filterValue === "pending" && !task.completed)) {
            createTaskElement(task.text, task.completed);
        }
    });
}
