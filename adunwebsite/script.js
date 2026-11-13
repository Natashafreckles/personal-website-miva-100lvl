"use strict";

// Find the mobile navigation controls so the menu can be opened and closed.
const menuToggle = document.querySelector(".menu-toggle");
const primaryNav = document.querySelector("#primary-nav");

if (menuToggle && primaryNav) {
  // Keep the menu's visual state and accessibility attributes in sync.
  menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Open navigation" : "Close navigation",
    );
    primaryNav.classList.toggle("is-open", !isOpen);
  });

  // Close the mobile menu after a navigation link is selected.
  primaryNav.addEventListener("click", (event) => {
    if (event.target instanceof HTMLAnchorElement) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      primaryNav.classList.remove("is-open");
    }
  });
}

// Keep every displayed copyright year current.
document.querySelectorAll("[data-year]").forEach((element) => {
  element.textContent = String(new Date().getFullYear());
});

// Locate the academic planner controls and define its localStorage key.
const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("[data-task-count]");
const emptyState = document.querySelector("#empty-state");
const clearCompletedButton = document.querySelector("#clear-completed");
const taskStorageKey = "alexMorganAcademicTasks";

// Load saved tasks and discard entries that do not match the expected shape.
function readTasks() {
  try {
    const savedTasks = localStorage.getItem(taskStorageKey);
    if (!savedTasks) return [];
    const parsedTasks = JSON.parse(savedTasks);
    if (!Array.isArray(parsedTasks))
      throw new TypeError("Saved tasks must be an array.");
    return parsedTasks.filter(
      (task) =>
        task &&
        typeof task.id === "string" &&
        typeof task.text === "string" &&
        typeof task.completed === "boolean",
    );
  } catch (error) {
    console.error("Could not load saved planner tasks.", error);
    return [];
  }
}

// Keep the planner's current task data in memory while the page is open.
let tasks = readTasks();

// Persist the current task list in this browser.
function saveTasks() {
  try {
    localStorage.setItem(taskStorageKey, JSON.stringify(tasks));
  } catch (error) {
    console.error("Could not save planner tasks.", error);
  }
}

// Update the remaining-task number and its singular or plural label.
function updateTaskCount() {
  if (!taskCount) return;
  const remaining = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = String(remaining);
  const countLabel = taskCount.nextElementSibling;
  if (countLabel)
    countLabel.textContent = remaining === 1 ? "task left" : "tasks left";
}

// Rebuild the task list from the current data and refresh related UI states.
function renderTasks() {
  if (!taskList) return;
  taskList.replaceChildren();

  tasks.forEach((task) => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " is-complete" : ""}`;

    // Let users mark a task complete and save the changed state.
    const checkbox = document.createElement("input");
    checkbox.className = "task-check";
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute(
      "aria-label",
      `Mark "${task.text}" as ${task.completed ? "not completed" : "completed"}`,
    );
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const label = document.createElement("span");
    label.className = "task-label";
    label.textContent = task.text;

    // Let users delete this task, then persist and redraw the list.
    const deleteButton = document.createElement("button");
    deleteButton.className = "delete-task";
    deleteButton.type = "button";
    deleteButton.textContent = "×";
    deleteButton.setAttribute("aria-label", `Delete "${task.text}"`);
    deleteButton.addEventListener("click", () => {
      tasks = tasks.filter((entry) => entry.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, label, deleteButton);
    taskList.append(item);
  });

  if (emptyState) emptyState.hidden = tasks.length > 0;
  updateTaskCount();
}

// Validate and add submitted tasks, then clear and refocus the input.
if (taskForm && taskInput) {
  taskForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const text = taskInput.value.trim();
    if (!text) {
      taskInput.focus();
      return;
    }

    tasks.unshift({ id: crypto.randomUUID(), text, completed: false });
    saveTasks();
    renderTasks();
    taskForm.reset();
    taskInput.focus();
  });
}

// Remove all completed tasks when the clear button is selected.
if (clearCompletedButton) {
  clearCompletedButton.addEventListener("click", () => {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
  });
}

// Draw the initial planner view using tasks loaded from this browser.
renderTasks();

// Locate the contact form and validate it only on pages where it exists.
const contactForm = document.querySelector("#contact-form");

if (contactForm) {
  // Connect each form input to its inline error message.
  const result = document.querySelector("#form-result");
  const fields = {
    name: {
      input: contactForm.elements.namedItem("name"),
      error: document.querySelector("#name-error"),
    },
    email: {
      input: contactForm.elements.namedItem("email"),
      error: document.querySelector("#email-error"),
    },
    phone: {
      input: contactForm.elements.namedItem("phone"),
      error: document.querySelector("#phone-error"),
    },
    message: {
      input: contactForm.elements.namedItem("message"),
      error: document.querySelector("#message-error"),
    },
  };
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const digitsPattern = /^\d+$/;

  // Show or clear a field's error and expose its invalid state to assistive tech.
  function setFieldError(field, message) {
    field.input.setAttribute("aria-invalid", message ? "true" : "false");
    field.error.textContent = message;
  }

  // Check all required fields and format rules before accepting the form.
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (result) result.textContent = "";
    let firstInvalidField = null;
    let isValid = true;

    Object.values(fields).forEach((field) => setFieldError(field, ""));

    // Validate each value and remember the first field that needs attention.
    Object.entries(fields).forEach(([name, field]) => {
      const value = field.input.value.trim();
      let errorMessage = "";
      if (!value) {
        errorMessage = "This field is required.";
      } else if (name === "email" && !emailPattern.test(value)) {
        errorMessage = "Enter a valid email address.";
      } else if (name === "phone" && !digitsPattern.test(value)) {
        errorMessage = "Use digits only, with no spaces or symbols.";
      }

      if (errorMessage) {
        isValid = false;
        setFieldError(field, errorMessage);
        firstInvalidField ??= field.input;
      }
    });

    if (!isValid) {
      firstInvalidField.focus();
      return;
    }

    // This demo validates locally; it does not send the message to a server.
    contactForm.reset();
    if (result)
      result.textContent =
        "Thanks for your message! This demo form has been validated successfully.";
  });

  // Clear a field's error as soon as the user edits that field.
  Object.values(fields).forEach((field) => {
    field.input.addEventListener("input", () => {
      if (field.input.getAttribute("aria-invalid") === "true")
        setFieldError(field, "");
    });
  });
}
