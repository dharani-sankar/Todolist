# Ex03 To-Do List using JavaScript
## Date: 03.11.2026

## AIM
To create a To-do Application with all features using JavaScript.

## ALGORITHM
### STEP 1
Build the HTML structure (index.html).

### STEP 2
Style the App (style.css).

### STEP 3
Plan the features the To-Do App should have.

### STEP 4
Create a To-do application using Javascript.

### STEP 5
Add functionalities.

### STEP 6
Test the App.

### STEP 7
Open the HTML file in a browser to check layout and functionality.

### STEP 8
Fix styling issues and refine content placement.

### STEP 9
Deploy the website.

### STEP 10
Upload to GitHub Pages for free hosting.

### PROGRAM
##index.html
```
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>To-Do List</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <main class="app">
    <h1>My Tasks</h1>
    <p id="counter" class="counter">0 tasks left</p>

    <form id="todo-form" class="todo-form">
      <input type="text" id="todo-input" placeholder="Add a new task..." autocomplete="off" required>
      <input type="date" id="todo-date" aria-label="Due date">
      <button type="submit">Add task</button>
    </form>

    <div class="toolbar">
      <input type="search" id="search" placeholder="Search tasks...">
      <div class="filters">
        <button class="filter active" data-filter="all">All</button>
        <button class="filter" data-filter="active">Active</button>
        <button class="filter" data-filter="completed">Completed</button>
      </div>
    </div>

    <ul id="todo-list" class="todo-list"></ul>
    <p id="empty" class="empty" hidden>No tasks here. Add one above.</p>

    <button id="clear-completed" class="clear">Clear completed</button>
  </main>
  <script src="script.js"></script>
</body>
</html>
```
##style.css
```
* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "Segoe UI", Arial, sans-serif;
  background: #e8eef3;
  color: #1f2d3a;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  padding: 40px 16px;
}

.app {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 12px;
  padding: 28px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, .08);
  align-self: flex-start;
}

h1 { font-size: 1.8rem; }
.counter { color: #6b7c8a; margin: 4px 0 18px; font-size: .9rem; }

.todo-form { display: flex; gap: 8px; flex-wrap: wrap; }
.todo-form input[type="text"] { flex: 1 1 180px; }

input, button { font: inherit; }
input {
  padding: 10px 12px;
  border: 1px solid #c5d0d9;
  border-radius: 8px;
}
input:focus-visible, button:focus-visible {
  outline: 2px solid #1d6fa5;
  outline-offset: 2px;
}

button {
  cursor: pointer;
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  background: #1d6fa5;
  color: #fff;
}
button:hover { background: #165a87; }

.toolbar { margin-top: 18px; display: flex; flex-direction: column; gap: 10px; }
.filters { display: flex; gap: 6px; }
.filter { background: #eef2f5; color: #1f2d3a; flex: 1; }
.filter:hover { background: #dde5ec; }
.filter.active { background: #1d6fa5; color: #fff; }

.todo-list { list-style: none; margin-top: 16px; }

.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 8px;
  border-bottom: 1px solid #e3e9ee;
}
.todo-item .text { flex: 1; word-break: break-word; }
.todo-item .due { display: block; font-size: .78rem; color: #6b7c8a; }
.todo-item .due.overdue { color: #c0392b; font-weight: 600; }
.todo-item.completed .title { text-decoration: line-through; color: #94a3b0; }

.todo-item .edit-input { flex: 1; }
.icon-btn { padding: 6px 10px; font-size: .85rem; }
.icon-btn.edit { background: #e0a21a; }
.icon-btn.edit:hover { background: #c58d12; }
.icon-btn.delete { background: #c0392b; }
.icon-btn.delete:hover { background: #a02f23; }

.empty { text-align: center; color: #6b7c8a; padding: 24px 0; }
.clear { margin-top: 16px; background: #6b7c8a; width: 100%; }
.clear:hover { background: #55656f; }

@media (max-width: 480px) {
  .app { padding: 18px; }
}
```
##script.js
```
// ---------- State ----------
const STORAGE_KEY = "todo-tasks";
let tasks = loadTasks();
let currentFilter = "all";
let searchText = "";
let editingId = null;

// ---------- DOM references ----------
const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const dateInput = document.getElementById("todo-date");
const list = document.getElementById("todo-list");
const counter = document.getElementById("counter");
const emptyMsg = document.getElementById("empty");
const searchBox = document.getElementById("search");
const clearBtn = document.getElementById("clear-completed");
const filterBtns = document.querySelectorAll(".filter");

// ---------- Local Storage ----------
function loadTasks() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------- Core functions ----------
function addTask(title, dueDate) {
  tasks.push({
    id: Date.now(),
    title: title.trim(),
    dueDate: dueDate || "",
    completed: false
  });
  update();
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  update();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  update();
}

function saveEdit(id, newTitle) {
  const title = newTitle.trim();
  if (title) {
    tasks.find(t => t.id === id).title = title;
  }
  editingId = null;
  update();
}

function clearCompleted() {
  tasks = tasks.filter(t => !t.completed);
  update();
}

// ---------- Rendering ----------
function getVisibleTasks() {
  return tasks.filter(t => {
    const matchesFilter =
      currentFilter === "all" ||
      (currentFilter === "active" && !t.completed) ||
      (currentFilter === "completed" && t.completed);
    const matchesSearch = t.title.toLowerCase().includes(searchText.toLowerCase());
    return matchesFilter && matchesSearch;
  });
}

function isOverdue(task) {
  if (!task.dueDate || task.completed) return false;
  const today = new Date().toISOString().split("T")[0];
  return task.dueDate < today;
}

function render() {
  list.innerHTML = "";
  const visible = getVisibleTasks();

  visible.forEach(task => {
    const li = document.createElement("li");
    li.className = "todo-item" + (task.completed ? " completed" : "");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", "Mark task as completed");
    checkbox.addEventListener("change", () => toggleTask(task.id));
    li.appendChild(checkbox);

    if (editingId === task.id) {
      const editField = document.createElement("input");
      editField.type = "text";
      editField.className = "edit-input";
      editField.value = task.title;
      editField.addEventListener("keydown", e => {
        if (e.key === "Enter") saveEdit(task.id, editField.value);
        if (e.key === "Escape") { editingId = null; render(); }
      });
      li.appendChild(editField);

      const saveBtn = makeButton("Save", "icon-btn", () => saveEdit(task.id, editField.value));
      li.appendChild(saveBtn);
      setTimeout(() => editField.focus(), 0);
    } else {
      const text = document.createElement("div");
      text.className = "text";

      const title = document.createElement("span");
      title.className = "title";
      title.textContent = task.title;
      title.addEventListener("dblclick", () => { editingId = task.id; render(); });
      text.appendChild(title);

      if (task.dueDate) {
        const due = document.createElement("span");
        due.className = "due" + (isOverdue(task) ? " overdue" : "");
        due.textContent = (isOverdue(task) ? "Overdue: " : "Due: ") + task.dueDate;
        text.appendChild(due);
      }
      li.appendChild(text);

      li.appendChild(makeButton("Edit", "icon-btn edit", () => { editingId = task.id; render(); }));
      li.appendChild(makeButton("Delete", "icon-btn delete", () => deleteTask(task.id)));
    }
    list.appendChild(li);
  });

  emptyMsg.hidden = visible.length > 0;

  const left = tasks.filter(t => !t.completed).length;
  counter.textContent = left + (left === 1 ? " task left" : " tasks left");
}

function makeButton(label, className, handler) {
  const btn = document.createElement("button");
  btn.textContent = label;
  btn.className = className;
  btn.type = "button";
  btn.addEventListener("click", handler);
  return btn;
}

function update() {
  saveTasks();
  render();
}

// ---------- Event listeners ----------
form.addEventListener("submit", e => {
  e.preventDefault();
  if (!input.value.trim()) return;
  addTask(input.value, dateInput.value);
  form.reset();
  input.focus();
});

filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach(b => b.classList.toggle("active", b === btn));
    render();
  });
});

searchBox.addEventListener("input", () => {
  searchText = searchBox.value;
  render();
});

clearBtn.addEventListener("click", clearCompleted);

// ---------- Initial render ----------
render();
```

## OUTPUT

<img width="1920" height="1080" alt="Screenshot (321)" src="https://github.com/user-attachments/assets/0f660694-6075-4761-84f5-1f9497e71895" />



## RESULT
The program for creating To-do list using JavaScript is executed successfully.
