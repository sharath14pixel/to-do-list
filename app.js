/**
 * ============================================================================
 * ApexTask • Guided Step-by-Step Task Creation Engine
 * 100% Vanilla JavaScript • Zero Mock Data • Zero External Dependencies
 * ============================================================================
 */

(function () {
  'use strict';

  // --- Priority Order Weights ---
  const PRIORITY_WEIGHT = {
    urgent: 4,
    high: 3,
    medium: 2,
    low: 1,
  };

  // --- DOM Elements ---
  const docHtml = document.documentElement;

  // Header Elements
  const hamburgerBtn = document.getElementById('hamburger-btn');
  const btnOpenSettings = document.getElementById('btn-open-settings');
  const meterPercentEl = document.getElementById('meter-percent');
  const meterFillEl = document.getElementById('meter-fill');

  // Drawer Elements
  const sideDrawer = document.getElementById('side-drawer');
  const drawerBackdrop = document.getElementById('drawer-backdrop');
  const closeDrawerBtn = document.getElementById('close-drawer-btn');
  const drawerNav = document.querySelector('.drawer-nav');
  const drawerCategories = document.getElementById('drawer-categories');
  const sortSelect = document.getElementById('sort-select');

  // Drawer Badge Counters
  const badgeAllCount = document.getElementById('badge-all-count');
  const badgeActiveCount = document.getElementById('badge-active-count');
  const badgeDoneCount = document.getElementById('badge-done-count');

  const catCountAll = document.getElementById('cat-count-all');
  const catCountDev = document.getElementById('cat-count-dev');
  const catCountDesign = document.getElementById('cat-count-design');
  const catCountWork = document.getElementById('cat-count-work');
  const catCountPersonal = document.getElementById('cat-count-personal');
  const catCountStudy = document.getElementById('cat-count-study');

  // Workspace View Header
  const viewIcon = document.getElementById('view-icon');
  const viewTitle = document.getElementById('view-title');
  const viewSubtitle = document.getElementById('view-subtitle');
  const btnResetView = document.getElementById('btn-reset-view');

  // Guided Step-by-Step Wizard Elements
  const wizardForm = document.getElementById('wizard-form');
  const wizardStepTitle = document.getElementById('wizard-step-title');
  const wizardStepSubtitle = document.getElementById('wizard-step-subtitle');
  const wizardStepIndicators = document.querySelectorAll('.step-indicator-item');

  const stepPane1 = document.getElementById('step-pane-1');
  const stepPane2 = document.getElementById('step-pane-2');
  const stepPane3 = document.getElementById('step-pane-3');

  const wizardPrevBtn = document.getElementById('wizard-prev-btn');
  const wizardNextBtn = document.getElementById('wizard-next-btn');
  const wizardSubmitBtn = document.getElementById('wizard-submit-btn');

  // Step 1 Inputs
  const wizardTaskText = document.getElementById('wizard-task-text');
  const wizardCategory = document.getElementById('wizard-category');
  const wizardPrioBtns = document.querySelectorAll('.wizard-prio-btn');

  // Step 2 Inputs
  const wizardDueDate = document.getElementById('wizard-due-date');
  const wizardEstHours = document.getElementById('wizard-est-hours');

  // Step 3 Inputs & Summary
  const wizardNewSubtask = document.getElementById('wizard-new-subtask');
  const wizardAddSubtaskBtn = document.getElementById('wizard-add-subtask-btn');
  const wizardSubtaskDrafts = document.getElementById('wizard-subtask-drafts');
  const summaryTitle = document.getElementById('summary-title');
  const summaryPrio = document.getElementById('summary-prio');
  const summaryCat = document.getElementById('summary-cat');
  const summaryDue = document.getElementById('summary-due');
  const summaryEst = document.getElementById('summary-est');
  const wizardValidationHint = document.getElementById('wizard-validation-hint');

  // Search
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search');

  // Task List & Card
  const listEl = document.getElementById('list');
  const statusTabGroup = document.querySelector('.status-tab-group');
  const countEl = document.getElementById('count');
  const clearCompletedBtn = document.getElementById('clear-completed');
  const emptyStateEl = document.getElementById('empty-state');
  const emptyIconEl = document.getElementById('empty-icon');
  const emptyTitleEl = document.getElementById('empty-title');
  const emptyDescEl = document.getElementById('empty-desc');

  // History (Undo / Redo)
  const btnUndo = document.getElementById('btn-undo-action');
  const btnRedo = document.getElementById('btn-redo-action');

  // Settings Modal Dialog
  const settingsDialog = document.getElementById('settings-dialog');
  const closeSettingsBtn = document.getElementById('close-settings-btn');
  const btnDoneSettings = document.getElementById('btn-done-settings');
  const themeChoiceBtns = document.querySelectorAll('.theme-choice-btn');
  const btnSettingsExport = document.getElementById('btn-settings-export');
  const importFileSettings = document.getElementById('import-file-settings');
  const btnPurgeData = document.getElementById('btn-purge-data');

  // Edit Task Modal Dialog
  const editDialog = document.getElementById('edit-dialog');
  const editForm = document.getElementById('edit-form');
  const editText = document.getElementById('edit-text');
  const editPriority = document.getElementById('edit-priority');
  const editCategory = document.getElementById('edit-category');
  const editDue = document.getElementById('edit-due');
  const editEst = document.getElementById('edit-est');
  const modalSubtaskList = document.getElementById('modal-subtask-list');
  const modalNewSubtaskText = document.getElementById('modal-new-subtask-text');
  const modalAddSubtaskBtn = document.getElementById('modal-add-subtask-btn');
  const cancelEditBtn = document.getElementById('cancel-edit-btn');
  const closeEditDialogBtn = document.getElementById('close-edit-dialog-btn');

  // Toast Container
  const toastContainer = document.getElementById('toast-container');

  // ==========================================================================
  // Category Metadata & Normalized Matching
  // ==========================================================================
  const CATEGORIES = {
    all: { key: 'all', label: 'All Tasks', icon: '🌟', sub: 'Viewing all tasks across workspaces' },
    Dev: { key: 'Dev', label: 'Dev & Engineering', icon: '⚡', sub: 'Engineering, code & technical tasks' },
    Design: { key: 'Design', label: 'UI & UX Design', icon: '🎨', sub: 'Design, prototypes & interface tasks' },
    Work: { key: 'Work', label: 'Corporate & Business', icon: '💼', sub: 'Corporate, meetings & operations' },
    Personal: { key: 'Personal', label: 'Personal & Life', icon: '🏠', sub: 'Habits, personal errands & life' },
    Study: { key: 'Study', label: 'Learning & Study', icon: '📚', sub: 'Courses, reading & research' },
    General: { key: 'General', label: 'General', icon: '📁', sub: 'Uncategorized tasks' },
  };

  function matchCategory(taskCategory, targetCategory) {
    if (!targetCategory || targetCategory === 'all') return true;
    if (!taskCategory) return false;

    const t = String(taskCategory).trim().toLowerCase();
    const target = String(targetCategory).trim().toLowerCase();

    if (t === target) return true;

    const aliases = {
      dev: ['dev', 'engineering', 'development', 'code', 'software'],
      design: ['design', 'ui', 'ux', 'ui/ux', 'ui & ux', 'ui & product design'],
      work: ['work', 'business', 'corporate', 'office'],
      personal: ['personal', 'life', 'home'],
      study: ['study', 'learning', 'education', 'research'],
      general: ['general', 'misc'],
    };

    for (const [key, list] of Object.entries(aliases)) {
      if ((target === key || list.includes(target)) && (t === key || list.includes(t))) {
        return true;
      }
    }

    return t.includes(target) || target.includes(t);
  }

  function getCategoryMeta(key) {
    return CATEGORIES[key] || CATEGORIES.General;
  }

  // ==========================================================================
  // Theme Management
  // ==========================================================================
  let activeTheme = localStorage.getItem('apextasks_theme_live') || 'dark';
  applyTheme(activeTheme);

  function applyTheme(theme) {
    docHtml.setAttribute('data-theme', theme);
    localStorage.setItem('apextasks_theme_live', theme);
    themeChoiceBtns.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.theme === theme);
    });
  }

  // ==========================================================================
  // State Management (ZERO MOCK DATA)
  // ==========================================================================
  const STORAGE_KEY = 'apextasks_production_clean';

  // Automatically wipe legacy mock keys so user starts with a 100% clean list
  ['apextasks_v4', 'apextasks_v3', 'apextasks_v2', 'apextasks_clean_v1'].forEach((k) => {
    try { localStorage.removeItem(k); } catch (e) {}
  });

  let tasks = loadTasks();
  let currentFilter = 'all';
  let currentCategory = 'all';
  let currentSearch = '';
  let currentSort = 'custom';
  let editingTaskId = null;
  let editingSubtasksBuffer = [];

  // Wizard In-Progress State
  let wizardCurrentStep = 1;
  let wizardPriority = 'medium';
  let wizardDraftSubtasks = [];

  const undoStack = [];
  const redoStack = [];
  const MAX_HISTORY = 30;

  function pushHistoryState() {
    undoStack.push(JSON.stringify(tasks));
    if (undoStack.length > MAX_HISTORY) undoStack.shift();
    redoStack.length = 0;
    updateHistoryButtons();
  }

  function updateHistoryButtons() {
    btnUndo.disabled = undoStack.length === 0;
    btnRedo.disabled = redoStack.length === 0;
  }

  function loadTasks() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return []; // ZERO MOCK DATA - STARTS PURE EMPTY

      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) return [];

      return parsed
        .filter(
          (t) =>
            t &&
            typeof t === 'object' &&
            typeof t.id === 'number' &&
            typeof t.text === 'string' &&
            typeof t.done === 'boolean'
        )
        .map((t) => ({
          id: t.id,
          text: t.text.trim(),
          done: t.done,
          priority: ['low', 'medium', 'high', 'urgent'].includes(t.priority) ? t.priority : 'medium',
          category: typeof t.category === 'string' ? t.category : 'General',
          dueDate: typeof t.dueDate === 'string' ? t.dueDate : '',
          estHours: typeof t.estHours === 'number' ? t.estHours : null,
          subtasks: Array.isArray(t.subtasks)
            ? t.subtasks.map((st) => ({
                id: typeof st.id === 'number' ? st.id : Date.now() + Math.random(),
                text: String(st.text || '').trim(),
                done: Boolean(st.done),
              }))
            : [],
          createdAt: typeof t.createdAt === 'number' ? t.createdAt : t.id,
        }));
    } catch (e) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (err) {
      showToast('Storage quota reached');
    }
  }

  // ==========================================================================
  // Guided Step-by-Step Task Creation Procedure
  // ==========================================================================
  function updateWizardUI() {
    [stepPane1, stepPane2, stepPane3].forEach((pane, idx) => {
      pane.classList.toggle('active', idx + 1 === wizardCurrentStep);
    });

    wizardStepIndicators.forEach((ind) => {
      const step = Number(ind.dataset.step);
      ind.classList.toggle('active', step === wizardCurrentStep);
      ind.classList.toggle('completed', step < wizardCurrentStep);
    });

    if (wizardCurrentStep === 1) {
      wizardStepTitle.textContent = 'Step 1: Task Scope & Definition';
      wizardStepSubtitle.textContent = 'Define task name, engineering workstream domain, and priority tier.';
      wizardPrevBtn.disabled = true;
      wizardNextBtn.style.display = 'inline-block';
      wizardSubmitBtn.style.display = 'none';
    } else if (wizardCurrentStep === 2) {
      wizardStepTitle.textContent = 'Step 2: Planning & Scheduling';
      wizardStepSubtitle.textContent = 'Specify target completion deadline and estimated workload hours.';
      wizardPrevBtn.disabled = false;
      wizardNextBtn.style.display = 'inline-block';
      wizardSubmitBtn.style.display = 'none';
    } else if (wizardCurrentStep === 3) {
      wizardStepTitle.textContent = 'Step 3: Subtask Breakdown & Confirmation';
      wizardStepSubtitle.textContent = 'Decompose task into atomic checklist steps and verify final specification.';
      wizardPrevBtn.disabled = false;
      wizardNextBtn.style.display = 'none';
      wizardSubmitBtn.style.display = 'inline-block';

      summaryTitle.textContent = wizardTaskText.value.trim() || 'Untitled Task';
      summaryCat.textContent = wizardCategory.options[wizardCategory.selectedIndex]?.text || wizardCategory.value;
      summaryDue.textContent = wizardDueDate.value || 'No deadline';
      summaryEst.textContent = wizardEstHours.value ? `${wizardEstHours.value} hrs` : 'Not specified';

      summaryPrio.className = `summary-chip ${wizardPriority}`;
      summaryPrio.textContent = wizardPriority.toUpperCase();
    }
  }

  wizardPrioBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      wizardPrioBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      wizardPriority = btn.dataset.val;
    });
  });

  function renderWizardDraftSubtasks() {
    wizardSubtaskDrafts.textContent = '';
    wizardDraftSubtasks.forEach((st, idx) => {
      const div = document.createElement('div');
      div.className = 'draft-subtask-row';

      const text = document.createElement('span');
      text.textContent = `Step ${idx + 1}: ${st.text}`;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'draft-subtask-del';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Remove Step';
      delBtn.addEventListener('click', () => {
        wizardDraftSubtasks.splice(idx, 1);
        renderWizardDraftSubtasks();
      });

      div.appendChild(text);
      div.appendChild(delBtn);
      wizardSubtaskDrafts.appendChild(div);
    });
  }

  function addDraftSubtask() {
    const val = wizardNewSubtask.value.trim();
    if (!val) return;
    wizardDraftSubtasks.push({
      id: Date.now() + Math.random(),
      text: val,
      done: false,
    });
    wizardNewSubtask.value = '';
    renderWizardDraftSubtasks();
  }

  wizardAddSubtaskBtn.addEventListener('click', addDraftSubtask);
  wizardNewSubtask.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addDraftSubtask();
    }
  });

  wizardNextBtn.addEventListener('click', () => {
    if (wizardCurrentStep === 1) {
      if (!wizardTaskText.value.trim()) {
        wizardValidationHint.classList.add('show');
        wizardTaskText.focus();
        return;
      }
      wizardValidationHint.classList.remove('show');
      wizardCurrentStep = 2;
    } else if (wizardCurrentStep === 2) {
      wizardCurrentStep = 3;
    }
    updateWizardUI();
  });

  wizardPrevBtn.addEventListener('click', () => {
    if (wizardCurrentStep > 1) {
      wizardCurrentStep--;
      updateWizardUI();
    }
  });

  wizardTaskText.addEventListener('input', () => {
    if (wizardValidationHint.classList.contains('show')) {
      wizardValidationHint.classList.remove('show');
    }
  });

  // Final Step: Commit & Create Task
  wizardForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const titleVal = wizardTaskText.value.trim();

    if (!titleVal) {
      wizardCurrentStep = 1;
      updateWizardUI();
      wizardValidationHint.classList.add('show');
      wizardTaskText.focus();
      return;
    }

    pushHistoryState();

    const newTask = {
      id: Date.now(),
      text: titleVal,
      done: false,
      priority: wizardPriority,
      category: wizardCategory.value,
      dueDate: wizardDueDate.value || '',
      estHours: wizardEstHours.value ? parseFloat(wizardEstHours.value) : null,
      subtasks: [...wizardDraftSubtasks],
      createdAt: Date.now(),
    };

    tasks.unshift(newTask);
    saveTasks();

    // Reset Wizard to Step 1
    wizardTaskText.value = '';
    wizardDueDate.value = '';
    wizardEstHours.value = '';
    wizardNewSubtask.value = '';
    wizardDraftSubtasks = [];
    renderWizardDraftSubtasks();
    wizardCurrentStep = 1;
    updateWizardUI();

    render();
    showToast('Task created successfully! 🚀');
  });

  // ==========================================================================
  // Core Rendering Engine
  // ==========================================================================
  function render() {
    listEl.textContent = '';

    // Filter by Status (all, active, done)
    let filtered = tasks.filter((t) => {
      if (currentFilter === 'active') return !t.done;
      if (currentFilter === 'done') return t.done;
      return true;
    });

    // Filter by Workspace Category
    if (currentCategory !== 'all') {
      filtered = filtered.filter((t) => matchCategory(t.category, currentCategory));
    }

    // Filter by Search Query
    if (currentSearch) {
      const q = currentSearch.toLowerCase();
      filtered = filtered.filter(
        (t) =>
          t.text.toLowerCase().includes(q) ||
          t.category.toLowerCase().includes(q) ||
          t.priority.toLowerCase().includes(q) ||
          t.subtasks.some((st) => st.text.toLowerCase().includes(q))
      );
    }

    // Sort tasks
    filtered = sortTasks(filtered, currentSort);

    // Build Task DOM Nodes
    filtered.forEach((task) => {
      listEl.appendChild(createTaskNode(task));
    });

    // Update Workspace View Header
    updateViewHeader(filtered.length);

    // Update Counts & Badges
    updateMetrics();

    // Empty State Check
    if (filtered.length === 0) {
      emptyStateEl.classList.add('show');
      if (currentSearch) {
        emptyIconEl.textContent = '🔍';
        emptyTitleEl.textContent = 'No matching tasks';
        emptyDescEl.textContent = `No tasks found matching "${currentSearch}". Try a different search keyword.`;
      } else if (currentFilter === 'done') {
        emptyIconEl.textContent = '📋';
        emptyTitleEl.textContent = 'No completed tasks';
        emptyDescEl.textContent = 'Check off tasks on your active list to build completed history.';
      } else if (currentFilter === 'active') {
        emptyIconEl.textContent = '🎉';
        emptyTitleEl.textContent = 'All clear!';
        emptyDescEl.textContent = 'Zero active tasks remaining in this workspace.';
      } else if (currentCategory !== 'all') {
        const meta = getCategoryMeta(currentCategory);
        emptyIconEl.textContent = meta.icon;
        emptyTitleEl.textContent = `No tasks in ${meta.label}`;
        emptyDescEl.textContent = `You have zero tasks in this domain. Use the step-by-step procedure above to create one!`;
      } else {
        emptyIconEl.textContent = '✨';
        emptyTitleEl.textContent = 'No tasks in this workspace';
        emptyDescEl.textContent = 'Your workspace is clean. Use the step-by-step procedure above to create your first task!';
      }
    } else {
      emptyStateEl.classList.remove('show');
    }

    // Update Filter Active States
    updateFilterStates();
  }

  function updateViewHeader(taskCount) {
    const meta = getCategoryMeta(currentCategory);
    viewIcon.textContent = meta.icon;
    viewTitle.textContent = meta.label;
    viewSubtitle.textContent = currentCategory === 'all'
      ? `${tasks.length} total tasks across all workspaces`
      : `${taskCount} task${taskCount === 1 ? '' : 's'} in ${meta.label}`;

    btnResetView.hidden = currentCategory === 'all';

    // Synchronize wizard category dropdown to current domain if not 'all'
    if (currentCategory !== 'all' && wizardCategory) {
      wizardCategory.value = currentCategory;
    }
  }

  function createTaskNode(task) {
    const li = document.createElement('li');
    li.className = `task-item-row ${task.done ? 'done' : ''}`;
    li.dataset.id = String(task.id);
    li.setAttribute('draggable', currentSort === 'custom' ? 'true' : 'false');

    // Checkbox Button
    const checkBtn = document.createElement('button');
    checkBtn.type = 'button';
    checkBtn.className = 'task-check-btn';
    checkBtn.dataset.action = 'toggle';
    checkBtn.setAttribute('aria-label', task.done ? `Mark "${task.text}" as active` : `Mark "${task.text}" as completed`);
    checkBtn.innerHTML = `
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
      </svg>
    `;

    // Content Box
    const contentBox = document.createElement('div');
    contentBox.className = 'task-item-content';

    const titleSpan = document.createElement('span');
    titleSpan.className = 'task-item-title';
    titleSpan.textContent = task.text; // STRICT XSS PROTECTION

    // Metadata Row
    const metaBox = document.createElement('div');
    metaBox.className = 'task-item-meta';

    // Priority Chip
    const prioChip = document.createElement('span');
    prioChip.className = `prio-chip ${task.priority}`;
    prioChip.textContent = task.priority;
    metaBox.appendChild(prioChip);

    // Category Chip
    const catMeta = getCategoryMeta(task.category);
    const catChip = document.createElement('button');
    catChip.type = 'button';
    catChip.className = 'cat-chip';
    catChip.dataset.action = 'filter-category';
    catChip.dataset.cat = catMeta.key;
    catChip.title = `Switch to ${catMeta.label}`;
    catChip.textContent = `${catMeta.icon} ${catMeta.label}`;
    metaBox.appendChild(catChip);

    // Estimated Hours Chip
    if (task.estHours) {
      const hoursChip = document.createElement('span');
      hoursChip.className = 'hours-chip';
      hoursChip.textContent = `⏱️ ${task.estHours}h`;
      metaBox.appendChild(hoursChip);
    }

    // Due Date Chip
    if (task.dueDate) {
      const dueChip = document.createElement('span');
      dueChip.className = 'due-chip';
      const todayStr = new Date().toISOString().split('T')[0];
      if (!task.done && task.dueDate < todayStr) {
        dueChip.classList.add('overdue');
        dueChip.textContent = `⚠️ Overdue (${task.dueDate})`;
      } else if (!task.done && task.dueDate === todayStr) {
        dueChip.classList.add('overdue');
        dueChip.textContent = `⚡ Due Today`;
      } else {
        dueChip.textContent = `📅 ${task.dueDate}`;
      }
      metaBox.appendChild(dueChip);
    }

    contentBox.appendChild(titleSpan);
    contentBox.appendChild(metaBox);

    // Render Subtasks Tree
    if (task.subtasks && task.subtasks.length > 0) {
      const subtasksTree = document.createElement('div');
      subtasksTree.className = 'task-subtasks-tree';

      task.subtasks.forEach((st) => {
        const stRow = document.createElement('div');
        stRow.className = `subtask-item-row ${st.done ? 'done' : ''}`;

        const stBtn = document.createElement('button');
        stBtn.type = 'button';
        stBtn.className = 'subtask-check';
        stBtn.dataset.action = 'toggle-subtask';
        stBtn.dataset.subtaskId = String(st.id);
        stBtn.innerHTML = `
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        `;

        const stText = document.createElement('span');
        stText.textContent = st.text;

        stRow.appendChild(stBtn);
        stRow.appendChild(stText);
        subtasksTree.appendChild(stRow);
      });

      contentBox.appendChild(subtasksTree);
    }

    // Actions Box (Edit & Delete)
    const actionsBox = document.createElement('div');
    actionsBox.className = 'task-item-actions';

    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'item-action-btn';
    editBtn.dataset.action = 'edit';
    editBtn.title = 'Edit Task Details';
    editBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
      </svg>
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.className = 'item-action-btn delete-btn';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.title = 'Delete Task';
    deleteBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <polyline points="3 6 5 6 21 6"></polyline>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
      </svg>
    `;

    actionsBox.appendChild(editBtn);
    actionsBox.appendChild(deleteBtn);

    li.appendChild(checkBtn);
    li.appendChild(contentBox);
    li.appendChild(actionsBox);

    return li;
  }

  function sortTasks(taskList, strategy) {
    const list = [...taskList];
    switch (strategy) {
      case 'created-desc':
        return list.sort((a, b) => b.createdAt - a.createdAt);
      case 'created-asc':
        return list.sort((a, b) => a.createdAt - b.createdAt);
      case 'due-asc':
        return list.sort((a, b) => {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return a.dueDate.localeCompare(b.dueDate);
        });
      case 'priority-desc':
        return list.sort((a, b) => (PRIORITY_WEIGHT[b.priority] || 0) - (PRIORITY_WEIGHT[a.priority] || 0));
      case 'alphabetical':
        return list.sort((a, b) => a.text.localeCompare(b.text));
      case 'custom':
      default:
        return list;
    }
  }

  function updateMetrics() {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.done).length;
    const remaining = total - completed;

    countEl.textContent = remaining === 1 ? '1 task remaining' : `${remaining} tasks remaining`;

    const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
    meterPercentEl.textContent = `${percent}%`;
    meterFillEl.style.width = `${percent}%`;

    // Status Badges
    if (badgeAllCount) badgeAllCount.textContent = String(total);
    if (badgeActiveCount) badgeActiveCount.textContent = String(remaining);
    if (badgeDoneCount) badgeDoneCount.textContent = String(completed);

    // Workspace Category Badges
    if (catCountAll) catCountAll.textContent = String(total);
    if (catCountDev) catCountDev.textContent = String(tasks.filter((t) => matchCategory(t.category, 'Dev')).length);
    if (catCountDesign) catCountDesign.textContent = String(tasks.filter((t) => matchCategory(t.category, 'Design')).length);
    if (catCountWork) catCountWork.textContent = String(tasks.filter((t) => matchCategory(t.category, 'Work')).length);
    if (catCountPersonal) catCountPersonal.textContent = String(tasks.filter((t) => matchCategory(t.category, 'Personal')).length);
    if (catCountStudy) catCountStudy.textContent = String(tasks.filter((t) => matchCategory(t.category, 'Study')).length);

    clearCompletedBtn.disabled = completed === 0;
  }

  function updateFilterStates() {
    statusTabGroup.querySelectorAll('.status-tab-btn').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.filter === currentFilter);
    });

    drawerNav.querySelectorAll('.drawer-nav-item').forEach((item) => {
      item.classList.toggle('active', item.dataset.filter === currentFilter);
    });

    drawerCategories.querySelectorAll('.drawer-cat-btn').forEach((btn) => {
      const cat = btn.dataset.cat;
      const isActive = cat === 'all' ? currentCategory === 'all' : matchCategory(cat, currentCategory);
      btn.classList.toggle('active', isActive);
    });
  }

  // ==========================================================================
  // Drawer (3-Lines): Workspace Navigation
  // ==========================================================================
  function openDrawer() {
    sideDrawer.classList.add('open');
    drawerBackdrop.classList.add('open');
  }

  function closeDrawer() {
    sideDrawer.classList.remove('open');
    drawerBackdrop.classList.remove('open');
  }

  hamburgerBtn.addEventListener('click', openDrawer);
  closeDrawerBtn.addEventListener('click', closeDrawer);
  drawerBackdrop.addEventListener('click', closeDrawer);

  drawerNav.addEventListener('click', (e) => {
    const item = e.target.closest('.drawer-nav-item');
    if (!item) return;
    currentFilter = item.dataset.filter;
    render();
    closeDrawer();
  });

  drawerCategories.addEventListener('click', (e) => {
    const btn = e.target.closest('.drawer-cat-btn');
    if (!btn) return;
    currentCategory = btn.dataset.cat;
    render();
    closeDrawer();
  });

  btnResetView.addEventListener('click', () => {
    currentCategory = 'all';
    render();
    showToast('Showing all tasks');
  });

  sortSelect.addEventListener('change', (e) => {
    currentSort = e.target.value;
    render();
  });

  // ==========================================================================
  // Settings Modal Controller
  // ==========================================================================
  btnOpenSettings.addEventListener('click', () => {
    settingsDialog.showModal();
  });

  closeSettingsBtn.addEventListener('click', () => settingsDialog.close());
  btnDoneSettings.addEventListener('click', () => settingsDialog.close());

  themeChoiceBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.theme);
    });
  });

  // Backup (Download JSON)
  btnSettingsExport.addEventListener('click', () => {
    const payload = JSON.stringify(tasks, null, 2);
    const blob = new Blob([payload], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `apextask-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Backup downloaded successfully! 💾');
  });

  // Import JSON
  importFileSettings.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (!Array.isArray(imported)) throw new Error('Invalid JSON format');

        pushHistoryState();
        const sanitized = imported.map((t) => ({
          id: typeof t.id === 'number' ? t.id : Date.now() + Math.random(),
          text: String(t.text || 'Imported Task').trim(),
          done: Boolean(t.done),
          priority: ['low', 'medium', 'high', 'urgent'].includes(t.priority) ? t.priority : 'medium',
          category: t.category || 'General',
          dueDate: t.dueDate || '',
          estHours: typeof t.estHours === 'number' ? t.estHours : null,
          subtasks: Array.isArray(t.subtasks) ? t.subtasks : [],
          createdAt: t.createdAt || Date.now(),
        }));

        tasks = [...sanitized, ...tasks];
        saveTasks();
        render();
        settingsDialog.close();
        showToast(`Imported ${sanitized.length} tasks!`);
      } catch (err) {
        showToast('Invalid backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  });

  // Clear All Tasks
  btnPurgeData.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete all tasks? This will reset your workspace.')) {
      pushHistoryState();
      tasks = [];
      saveTasks();
      render();
      settingsDialog.close();
      showToast('All tasks cleared');
    }
  });

  // ==========================================================================
  // Search & Card Status Tabs
  // ==========================================================================
  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim();
    clearSearchBtn.hidden = !currentSearch;
    render();
  });

  clearSearchBtn.addEventListener('click', () => {
    searchInput.value = '';
    currentSearch = '';
    clearSearchBtn.hidden = true;
    searchInput.focus();
    render();
  });

  statusTabGroup.addEventListener('click', (e) => {
    const btn = e.target.closest('.status-tab-btn');
    if (!btn) return;
    currentFilter = btn.dataset.filter;
    render();
  });

  // Task Row Event Delegation (Toggle, Edit, Delete, Subtask Toggle)
  listEl.addEventListener('click', (e) => {
    const target = e.target;

    // Toggle Subtask
    const subtaskBtn = target.closest('[data-action="toggle-subtask"]');
    if (subtaskBtn) {
      const li = subtaskBtn.closest('li');
      if (!li || !li.dataset.id) return;
      const taskId = Number(li.dataset.id);
      const subtaskId = Number(subtaskBtn.dataset.subtaskId);

      const task = tasks.find((t) => t.id === taskId);
      if (task && task.subtasks) {
        const st = task.subtasks.find((s) => s.id === subtaskId);
        if (st) {
          pushHistoryState();
          st.done = !st.done;
          saveTasks();
          render();
        }
      }
      return;
    }

    // Main Task Action
    const actionBtn = target.closest('[data-action]');
    if (!actionBtn) return;

    const li = actionBtn.closest('li');
    if (!li || !li.dataset.id) return;
    const taskId = Number(li.dataset.id);
    const action = actionBtn.dataset.action;

    if (action === 'toggle') {
      pushHistoryState();
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        task.done = !task.done;
        saveTasks();
        render();
      }
    } else if (action === 'delete') {
      pushHistoryState();
      tasks = tasks.filter((t) => t.id !== taskId);
      saveTasks();
      render();
      showToast('Task removed');
    } else if (action === 'edit') {
      openEditModal(taskId);
    } else if (action === 'filter-category') {
      const cat = actionBtn.dataset.cat;
      if (cat) {
        currentCategory = cat;
        render();
        const meta = getCategoryMeta(cat);
        showToast(`Switched to ${meta.label}`);
      }
    }
  });

  clearCompletedBtn.addEventListener('click', () => {
    const count = tasks.filter((t) => t.done).length;
    if (count === 0) return;
    pushHistoryState();
    tasks = tasks.filter((t) => !t.done);
    saveTasks();
    render();
    showToast(`Cleared ${count} completed tasks`);
  });

  // Drag and Drop Manual Reordering
  let draggedLi = null;

  listEl.addEventListener('dragstart', (e) => {
    if (currentSort !== 'custom') return;
    const li = e.target.closest('li');
    if (!li) return;
    draggedLi = li;
    li.classList.add('dragging');
  });

  listEl.addEventListener('dragend', () => {
    if (draggedLi) draggedLi.classList.remove('dragging');
    draggedLi = null;
    listEl.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
  });

  listEl.addEventListener('dragover', (e) => {
    e.preventDefault();
    if (!draggedLi || currentSort !== 'custom') return;
    const targetLi = e.target.closest('li');
    if (!targetLi || targetLi === draggedLi) return;
    listEl.querySelectorAll('.drag-over').forEach((el) => el.classList.remove('drag-over'));
    targetLi.classList.add('drag-over');
  });

  listEl.addEventListener('drop', (e) => {
    e.preventDefault();
    const targetLi = e.target.closest('li');
    if (!draggedLi || !targetLi || targetLi === draggedLi || currentSort !== 'custom') return;

    pushHistoryState();
    const fromId = Number(draggedLi.dataset.id);
    const toId = Number(targetLi.dataset.id);

    const fromIdx = tasks.findIndex((t) => t.id === fromId);
    const toIdx = tasks.findIndex((t) => t.id === toId);

    if (fromIdx > -1 && toIdx > -1) {
      const [moved] = tasks.splice(fromIdx, 1);
      tasks.splice(toIdx, 0, moved);
      saveTasks();
      render();
    }
  });

  // Undo / Redo
  function handleUndo() {
    if (undoStack.length === 0) return;
    redoStack.push(JSON.stringify(tasks));
    tasks = JSON.parse(undoStack.pop());
    saveTasks();
    render();
    updateHistoryButtons();
    showToast('Undo performed');
  }

  function handleRedo() {
    if (redoStack.length === 0) return;
    undoStack.push(JSON.stringify(tasks));
    tasks = JSON.parse(redoStack.pop());
    saveTasks();
    render();
    updateHistoryButtons();
    showToast('Redo performed');
  }

  btnUndo.addEventListener('click', handleUndo);
  btnRedo.addEventListener('click', handleRedo);

  // Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    if (e.key === '/' && document.activeElement !== wizardTaskText && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
      if (document.activeElement.tagName === 'INPUT') return;
      e.preventDefault();
      handleUndo();
    }
    if ((e.ctrlKey || e.metaKey) && (e.key.toLowerCase() === 'y' || (e.shiftKey && e.key.toLowerCase() === 'z'))) {
      if (document.activeElement.tagName === 'INPUT') return;
      e.preventDefault();
      handleRedo();
    }
  });

  // Edit Modal Dialog with Subtasks
  function openEditModal(taskId) {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    editingTaskId = taskId;
    editText.value = task.text;
    editPriority.value = task.priority;
    editCategory.value = task.category;
    editDue.value = task.dueDate || '';
    editEst.value = task.estHours || '';

    editingSubtasksBuffer = task.subtasks ? JSON.parse(JSON.stringify(task.subtasks)) : [];
    renderModalSubtasks();

    editDialog.showModal();
    editText.focus();
  }

  function renderModalSubtasks() {
    modalSubtaskList.textContent = '';
    editingSubtasksBuffer.forEach((st, idx) => {
      const div = document.createElement('div');
      div.className = 'modal-subtask-item';

      const label = document.createElement('span');
      label.textContent = `${st.done ? '☑' : '☐'} ${st.text}`;

      const delBtn = document.createElement('button');
      delBtn.type = 'button';
      delBtn.className = 'modal-subtask-del';
      delBtn.innerHTML = '&times;';
      delBtn.title = 'Remove subtask';
      delBtn.addEventListener('click', () => {
        editingSubtasksBuffer.splice(idx, 1);
        renderModalSubtasks();
      });

      div.appendChild(label);
      div.appendChild(delBtn);
      modalSubtaskList.appendChild(div);
    });
  }

  modalAddSubtaskBtn.addEventListener('click', () => {
    const val = modalNewSubtaskText.value.trim();
    if (!val) return;
    editingSubtasksBuffer.push({
      id: Date.now() + Math.random(),
      text: val,
      done: false,
    });
    modalNewSubtaskText.value = '';
    renderModalSubtasks();
  });

  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!editingTaskId) return;

    const trimmed = editText.value.trim();
    if (!trimmed) return;

    pushHistoryState();

    const task = tasks.find((t) => t.id === editingTaskId);
    if (task) {
      task.text = trimmed;
      task.priority = editPriority.value;
      task.category = editCategory.value;
      task.dueDate = editDue.value || '';
      task.estHours = editEst.value ? parseFloat(editEst.value) : null;
      task.subtasks = [...editingSubtasksBuffer];
      saveTasks();
      render();
      showToast('Task updated');
    }

    editDialog.close();
  });

  cancelEditBtn.addEventListener('click', () => editDialog.close());
  closeEditDialogBtn.addEventListener('click', () => editDialog.close());

  // Toast System
  function showToast(msg) {
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = msg;

    toastContainer.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('visible'));

    setTimeout(() => {
      toast.classList.remove('visible');
      setTimeout(() => toast.remove(), 250);
    }, 2400);
  }

  // Initial State: update wizard UI and render empty/saved tasks
  updateWizardUI();
  render();
})();
