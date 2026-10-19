
import React, { useState, useEffect } from "react";
import "./App.css";

function getToday() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

function formatDate(dateString) {
  if (!dateString) return "No due date";

  return new Date(dateString + "T00:00:00").toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
}

function App() {
  const today = getToday();

  const [name, setName] = useState("");
  const [showWelcome, setShowWelcome] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("Today");
  const [searchTerm, setSearchTerm] = useState("");
  const [clock, setClock] = useState(new Date());

  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState(today);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setClock(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Welcome popup
  const saveName = (event) => {
    event.preventDefault();

    const enteredName = name.trim();

    if (!enteredName) return;

    setName(enteredName);
    setTasks([]);
    setFilter("Today");
    setSearchTerm("");

    setShowWelcome(false);
    setShowAddTask(true);

    setTaskTitle("");
    setTaskDueDate(today);
    setEditingTaskId(null);
  };

  // Open a fresh Add Task popup
  const openAddTask = () => {
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDueDate(today);
    setShowAddTask(true);
  };

  // Close popup and go to dashboard
  const closeAddTask = () => {
    setShowAddTask(false);
    setEditingTaskId(null);
    setTaskTitle("");
    setTaskDueDate(today);
  };

  // Add multiple tasks without closing the popup
  const saveTask = (event) => {
    event.preventDefault();

    const title = taskTitle.trim();

    if (!title) return;

    // Editing an existing task
    if (editingTaskId !== null) {
      setTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === editingTaskId
            ? {
                ...task,
                title,
                dueDate: taskDueDate,
              }
            : task
        )
      );

      setEditingTaskId(null);
      setTaskTitle("");
      setTaskDueDate(today);
      setShowAddTask(false);

      return;
    }

    // Adding a new task
    const newTask = {
      id: Date.now() + Math.random(),
      title,
      dueDate: taskDueDate,
      completed: false,
      createdAt: today,
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);

    // Clear the input for the next task.
    // Keep the popup open so the user can continue adding tasks.
    setTaskTitle("");
    setTaskDueDate(today);

    // Keep showAddTask true.
    // Press Enter or click Add Task again to add another task.
  };

  // Mark task complete or incomplete
  const toggleTask = (id) => {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  // Edit a task
  const editTask = (task) => {
    setEditingTaskId(task.id);
    setTaskTitle(task.title);
    setTaskDueDate(task.dueDate || today);
    setShowAddTask(true);
  };

  // Delete a task
  const deleteTask = (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!confirmed) return;

    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  };

  // Switch user and start a fresh session
  const changeUser = () => {
    setName("");
    setTasks([]);
    setFilter("Today");
    setSearchTerm("");
    setTaskTitle("");
    setTaskDueDate(today);
    setEditingTaskId(null);

    setShowAddTask(false);
    setShowWelcome(true);
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const progress =
    tasks.length === 0
      ? 0
      : Math.round((completedTasks / tasks.length) * 100);

  const filters = [
    "Today",
    "Upcoming",
    "All Tasks",
    "Overdue",
    "Completed",
  ];

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filter === "Today") {
      return task.dueDate === today;
    }

    if (filter === "Upcoming") {
      return task.dueDate > today && !task.completed;
    }

    if (filter === "Overdue") {
      return (
        Boolean(task.dueDate) &&
        task.dueDate < today &&
        !task.completed
      );
    }

    if (filter === "Completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <div className="app-container">

      {/* WELCOME POPUP */}
      {showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-card">
            <div className="welcome-logo">✓</div>

            <h1>Welcome to TaskFlow</h1>

            <p>
              Your personal space to organize tasks and stay productive.
            </p>

            <form onSubmit={saveName}>
              <label htmlFor="userName">
                What should we call you?
              </label>

              <input
                id="userName"
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                autoFocus
                required
              />

              <button className="welcome-button" type="submit">
                Continue →
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ADD MULTIPLE TASKS POPUP */}
      {showAddTask && !showWelcome && (
        <div className="welcome-overlay">
          <div className="welcome-card add-task-card">
            <div className="welcome-logo">＋</div>

            <h1>
              {editingTaskId !== null
                ? "Edit Task"
                : "Add Your Tasks"}
            </h1>

            <p>
              {editingTaskId !== null
                ? "Update your task details below."
                : `Welcome, ${name}! Add as many tasks as you need.`}
            </p>

            {/* Pressing Enter submits this form */}
            <form onSubmit={saveTask}>
              <label htmlFor="taskTitle">
                Task name
              </label>

              <input
                id="taskTitle"
                type="text"
                placeholder="e.g. Complete my DevOps assignment"
                value={taskTitle}
                onChange={(event) =>
                  setTaskTitle(event.target.value)
                }
                autoFocus
                required
              />

              <label htmlFor="taskDueDate">
                Due date
              </label>

              <input
                id="taskDueDate"
                type="date"
                value={taskDueDate}
                onChange={(event) =>
                  setTaskDueDate(event.target.value)
                }
                required
              />

              <button className="welcome-button" type="submit">
                {editingTaskId !== null
                  ? "Save Changes"
                  : "Add Task +"}
              </button>

              {editingTaskId === null && (
                <p className="task-popup-hint">
                  Press Enter or click Add Task to add another.
                </p>
              )}

              {/* Done button is always available */}
              <button
                className="cancel-popup-button"
                type="button"
                onClick={closeAddTask}
              >
                {editingTaskId !== null
                  ? "Cancel"
                  : tasks.length > 0
                  ? `Done — View Dashboard (${tasks.length} tasks)`
                  : "Skip for Now — Open Dashboard"}
              </button>
            </form>

            {/* Show recently added tasks in the popup */}
            {editingTaskId === null && tasks.length > 0 && (
              <div className="popup-task-summary">
                <h3>Added tasks ({tasks.length})</h3>

                <div className="popup-task-list">
                  {tasks.map((task) => (
                    <div
                      className="popup-task-item"
                      key={task.id}
                    >
                      <span className="popup-task-check">✓</span>

                      <span className="popup-task-name">
                        {task.title}
                      </span>

                      <button
                        type="button"
                        className="popup-remove-task"
                        onClick={() => deleteTask(task.id)}
                        title="Remove task"
                        aria-label={`Remove ${task.title}`}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* DASHBOARD */}
      {!showWelcome && (
        <div className="dashboard-layout">

          {/* SIDEBAR */}
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-logo">✓</div>
              <span>TaskFlow</span>
            </div>

            <div className="sidebar-section">
              <p className="sidebar-label">WORKSPACE</p>

              {filters.map((item) => (
                <button
                  key={item}
                  className={`sidebar-link ${
                    filter === item ? "active" : ""
                  }`}
                  onClick={() => setFilter(item)}
                >
                  <span>
                    {item === "Today" && "☀"}
                    {item === "Upcoming" && "◷"}
                    {item === "All Tasks" && "▤"}
                    {item === "Overdue" && "!"}
                    {item === "Completed" && "✓"}
                  </span>

                  {item}

                  {item === "All Tasks" && (
                    <span className="sidebar-count">
                      {tasks.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            <div className="sidebar-bottom">
              <div className="profile-info">
                <div className="profile-avatar">
                  {name.charAt(0).toUpperCase()}
                </div>

                <div className="profile-details">
                  <strong>{name}</strong>
                  <span>TaskFlow User</span>
                </div>
              </div>

              <button
                className="change-user-button"
                onClick={changeUser}
              >
                Switch User
              </button>
            </div>
          </aside>

          {/* MAIN CONTENT */}
          <main className="main-content">
            <header className="topbar">
              <div>
                <p className="current-date">
                  {clock.toLocaleDateString("en-IN", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                <h2>
                  {getGreeting()}, {name}!
                </h2>

                <p className="welcome-subtitle">
                  Let's make today productive.
                </p>
              </div>

              <div className="topbar-right">
                <div className="live-clock">
                  <span className="clock-dot"></span>

                  {clock.toLocaleTimeString("en-IN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                  })}
                </div>

                <button
                  className="primary-button"
                  onClick={openAddTask}
                >
                  + Add Task
                </button>
              </div>
            </header>

            {/* STATISTICS */}
            <section className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon purple">▤</div>
                <p>Total Tasks</p>
                <h3>{tasks.length}</h3>
                <span>Tasks in your workspace</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon green">✓</div>
                <p>Completed</p>
                <h3>{completedTasks}</h3>
                <span>Tasks finished</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon orange">◷</div>
                <p>Pending</p>
                <h3>{tasks.length - completedTasks}</h3>
                <span>Tasks to work on</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">↗</div>
                <p>Progress</p>
                <h3>{progress}%</h3>
                <span>Your completion rate</span>
              </div>
            </section>

            {/* PROGRESS BAR */}
            <section className="progress-card">
              <div className="progress-heading">
                <div>
                  <h3>Daily Progress</h3>
                  <p>
                    Every completed task moves you forward.
                  </p>
                </div>

                <strong>{progress}%</strong>
              </div>

              <div className="progress-track">
                <div
                  className="progress-fill"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </section>

            {/* TASK LIST */}
            <section className="task-section">
              <div className="section-heading">
                <div>
                  <h3>{filter}</h3>
                  <p>
                    {filteredTasks.length}{" "}
                    {filteredTasks.length === 1
                      ? "task"
                      : "tasks"}{" "}
                    found
                  </p>
                </div>

                <button
                  className="primary-button"
                  onClick={openAddTask}
                >
                  + Add Task
                </button>
              </div>

              <div className="task-toolbar">
                <input
                  type="search"
                  placeholder="Search your tasks..."
                  value={searchTerm}
                  onChange={(event) =>
                    setSearchTerm(event.target.value)
                  }
                />

                <select
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value)
                  }
                  aria-label="Filter tasks"
                >
                  {filters.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="task-list">
                {filteredTasks.length === 0 ? (
                  <div className="empty-state">
                    <div className="empty-icon">✓</div>

                    <h3>No tasks found</h3>

                    <p>
                      {tasks.length === 0
                        ? "Start by adding your first task."
                        : "Try another filter or create a new task."}
                    </p>

                    <button
                      className="primary-button"
                      onClick={openAddTask}
                    >
                      + Create a Task
                    </button>
                  </div>
                ) : (
                  filteredTasks.map((task) => (
                    <div
                      className={`task-item ${
                        task.completed ? "task-completed" : ""
                      }`}
                      key={task.id}
                    >
                      <button
                        className={`task-checkbox ${
                          task.completed ? "checked" : ""
                        }`}
                        onClick={() => toggleTask(task.id)}
                        aria-label={
                          task.completed
                            ? "Mark task incomplete"
                            : "Mark task complete"
                        }
                      >
                        {task.completed ? "✓" : ""}
                      </button>

                      <div className="task-details">
                        <h4>{task.title}</h4>
                        <span>
                          Due: {formatDate(task.dueDate)}
                        </span>
                      </div>

                      <div className="task-actions">
                        <button
                          onClick={() => editTask(task)}
                          aria-label="Edit task"
                          title="Edit task"
                        >
                          ✎
                        </button>

                        <button
                          onClick={() => deleteTask(task.id)}
                          aria-label="Delete task"
                          title="Delete task"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>

            <footer className="dashboard-footer">
              <p>TaskFlow · Stay focused. Get things done.</p>
              <span>
                Session only · Tasks reset when you refresh
              </span>
            </footer>
          </main>
        </div>
      )}
    </div>
  );
}

export default App;
