# ⚡ ApexTask • Professional Task & Workflow Engine

> **A production-ready task manager with a guided step-by-step task creation procedure built entirely with vanilla HTML5, CSS3, and modern ES6+ JavaScript.**  
> Zero frameworks, zero build tools, zero external dependencies. Deployable immediately to GitHub Pages, Netlify, or Vercel.

---

## 🚀 Live Hosting & Deployment

This project is 100% client-side and requires **no build step**.

### Deploy to GitHub Pages:
1. Create a repository on GitHub (e.g. `todo-app`).
2. Push `index.html`, `style.css`, `app.js`, and `README.md`.
3. In repository settings, navigate to **Pages** and choose the `main` branch.
4. Your application is live instantly!

---

## 🏛️ Features & Architecture

1. **Guided Step-by-Step Task Creation Procedure**:
   - **Step 1 (Scope)**: Task title, engineering workstream domain (`Dev & Engineering`, `UI & UX Design`, `Corporate & Business`, `Personal & Life`, `Learning & Study`), and priority tier (`Low`, `Medium`, `High`, `Urgent`).
   - **Step 2 (Schedule)**: Target completion due date and estimated sprint workload effort in hours.
   - **Step 3 (Breakdown)**: Decompose the task into atomic acceptance checklist subtasks with live summary review.
   - **Commit**: Press **✓ Complete & Create Task** to deploy the task to your workspace.

2. **Clean Workspace Domains (3-Lines Drawer `☰`)**:
   - Dedicated drawer for workspace categories with live count badges on each domain.
   - Click any domain (e.g. **🎨 UI & UX Design**) to focus exclusively on that domain's tasks.
   - When inside a domain, newly created tasks in the wizard automatically default to that category.
   - A single-click **View All Tasks &times;** button restores the full view anytime.

3. **Pure Zero Mock Data**:
   - Starts 100% clean with an empty list. No fake or mock tasks.
   - Clean persistence in the browser's `localStorage`.

4. **Dedicated System Settings (`⚙️`)**:
   - Strictly isolated settings modal.
   - Choose between **Dark Slate**, **Midnight Glow**, or **Clean Light** themes.
   - **Backup**: 1-click download of your tasks as a JSON file.
   - **Restore Backup**: Import tasks from a JSON file.
   - **Clear All Data**: Safe purge to reset the workspace.

5. **Safety & XSS Immunity**:
   - User text is rendered strictly via `textContent`. Zero `innerHTML` execution on user-provided data.

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>/</kbd> | Instant focus to search input |
| <kbd>Ctrl</kbd> + <kbd>Z</kbd> | Undo last action |
| <kbd>Ctrl</kbd> + <kbd>Y</kbd> | Redo action |
| <kbd>Esc</kbd> | Dismiss open dialogs or menu drawer |

---

## 🚀 How to Run Locally

In Windows PowerShell:
```powershell
Start-Process "d:\todo\index.html"
```
Or open in VS Code with the **Live Server** extension.
