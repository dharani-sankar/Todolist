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
