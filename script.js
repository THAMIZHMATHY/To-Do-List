// Task Management
class TodoList {
  constructor() {
    this.tasks = this.loadFromLocalStorage();
    this.currentFilter = "all";
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.render();
  }

  setupEventListeners() {
    const addBtn = document.getElementById("addBtn");
    const todoInput = document.getElementById("todoInput");
    const filterBtns = document.querySelectorAll(".filter-btn");
    const clearBtn = document.getElementById("clearBtn");

    // Add task on button click
    addBtn.addEventListener("click", () => this.addTask());

    // Add task on Enter key press
    todoInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        this.addTask();
      }
    });

    // Filter tasks
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        document
          .querySelectorAll(".filter-btn")
          .forEach((b) => b.classList.remove("active"));
        e.target.classList.add("active");
        this.currentFilter = e.target.dataset.filter;
        this.render();
      });
    });

    // Clear completed tasks
    clearBtn.addEventListener("click", () => this.clearCompleted());
  }

  addTask() {
    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if (text === "") {
      alert("Please enter a task!");
      return;
    }

    const task = {
      id: Date.now(),
      text: text,
      completed: false,
      createdAt: new Date(),
    };

    this.tasks.push(task);
    this.saveToLocalStorage();
    this.render();
    input.value = "";
    input.focus();
  }

  deleteTask(id) {
    this.tasks = this.tasks.filter((task) => task.id !== id);
    this.saveToLocalStorage();
    this.render();
  }

  toggleTask(id) {
    const task = this.tasks.find((task) => task.id === id);
    if (task) {
      task.completed = !task.completed;
      this.saveToLocalStorage();
      this.render();
    }
  }

  clearCompleted() {
    const completedCount = this.tasks.filter((task) => task.completed).length;

    if (completedCount === 0) {
      alert("No completed tasks to clear!");
      return;
    }

    if (confirm(`Delete ${completedCount} completed task(s)?`)) {
      this.tasks = this.tasks.filter((task) => !task.completed);
      this.saveToLocalStorage();
      this.render();
    }
  }

  getFilteredTasks() {
    switch (this.currentFilter) {
      case "completed":
        return this.tasks.filter((task) => task.completed);
      case "active":
        return this.tasks.filter((task) => !task.completed);
      default:
        return this.tasks;
    }
  }

  render() {
    const todoList = document.getElementById("todoList");
    const taskCount = document.getElementById("taskCount");
    const filteredTasks = this.getFilteredTasks();

    // Update task counter (active tasks only)
    const activeTasks = this.tasks.filter((task) => !task.completed).length;
    taskCount.textContent = activeTasks;

    // Clear list
    todoList.innerHTML = "";

    if (filteredTasks.length === 0) {
      const emptyState = document.createElement("div");
      emptyState.className = "empty-state";

      let emptyMessage = "";
      switch (this.currentFilter) {
        case "completed":
          emptyMessage = "No completed tasks yet. Keep up the good work!";
          break;
        case "active":
          emptyMessage = "All tasks are done! You're all set.";
          break;
        default:
          emptyMessage = "No tasks yet. Add one to get started!";
      }

      emptyState.innerHTML = `<p>${emptyMessage}</p>`;
      todoList.appendChild(emptyState);
      return;
    }

    // Render tasks
    filteredTasks.forEach((task) => {
      const li = document.createElement("li");
      li.className = `todo-item ${task.completed ? "completed" : ""}`;
      li.innerHTML = `
                <input 
                    type="checkbox" 
                    ${task.completed ? "checked" : ""} 
                    data-id="${task.id}"
                >
                <span class="todo-text">${this.escapeHtml(task.text)}</span>
                <button class="delete-btn" data-id="${task.id}">Delete</button>
            `;

      // Add event listeners to new elements
      li.querySelector('input[type="checkbox"]').addEventListener(
        "change",
        (e) => {
          this.toggleTask(parseInt(e.target.dataset.id));
        },
      );

      li.querySelector(".delete-btn").addEventListener("click", (e) => {
        this.deleteTask(parseInt(e.target.dataset.id));
      });

      todoList.appendChild(li);
    });
  }

  saveToLocalStorage() {
    localStorage.setItem("todoTasks", JSON.stringify(this.tasks));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem("todoTasks");
    return data ? JSON.parse(data) : [];
  }

  escapeHtml(text) {
    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };
    return text.replace(/[&<>"']/g, (m) => map[m]);
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new TodoList();
});
